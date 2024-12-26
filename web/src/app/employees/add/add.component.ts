import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomValidators} from '../../custom.validators';
import {Incubator} from "../../entity/incubator";
import {Startup} from "../../entity/startup";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  employees = {
    eno: '',
    cardid: '',
    name: '',
    gender: 1,
    phone: '',
    company: ''
  };

  myForm: FormGroup;
  incubators: Incubator[];
  startups: Startup[];

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.myForm = new FormGroup({
      myNumber: new FormControl('', [CustomValidators.fiveDigitNumberStartingWith(3)])
    });

    this.httpClient.get<Array<Incubator>>('api/incubator/all').subscribe((incubators) => {
      console.log(incubators);
      this.incubators = incubators;
    });
    this.httpClient.get<Array<Startup>>('api/startup/all').subscribe((startups) => {
      console.log(startups);
      this.startups = startups;
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.httpClient.post('api/employees/add', this.employees)
      .subscribe(
        response => {
          console.log(response);
          this.sweetAlertService.showSuccess('新增成功', 'success');
          this.dialogRef.close(response);
        },
        error => {
          if (error.error.error === '员工已存在') {
            this.sweetAlertService.showError('新增失败', '员工已存在', 'error');
          } else {
            this.sweetAlertService.showError('新增失败', '', 'error');
          }
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
