import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomValidators} from '../../custom.validators';
import {Startup} from '../../entity/startup';
import {Investors} from '../../entity/investors';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  project = {
    num: '',
    startup_id: '',
    investor_id: '',
    incubator_id: ''
  };

  myForm: FormGroup;

  startups: Startup[];
  investors: Investors[];
  incubators: any[];

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.myForm = new FormGroup({
      myNumber: new FormControl('', [CustomValidators.fiveDigitNumberStartingWith(5)])
    });

    this.httpClient.get<Array<Startup>>('api/startup/all').subscribe((startups) => {
      console.log(startups);
      this.startups = startups;
    });
    this.httpClient.get<Array<Investors>>('api/investors/all').subscribe((investors) => {
      console.log(investors);
      this.investors = investors;
    });
    this.httpClient.get<Array<any>>('api/incubatoremployee/all').subscribe((incubators) => {
      console.log(incubators);
      this.incubators = incubators;
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.httpClient.post('api/project/add', this.project)
      .subscribe(
        response => {
          console.log(response);
          this.sweetAlertService.showSuccess('新增成功', 'success');
          this.dialogRef.close(response);
        },
        error => {
          if (error.error.error === '项目已存在') {
            this.sweetAlertService.showError('新增失败', '项目已存在', 'error');
          } else {
            this.sweetAlertService.showError('新增失败', '', 'error');
          }
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
