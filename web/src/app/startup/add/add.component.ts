import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {CustomValidators} from '../../custom.validators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  startup = {
    sno: '',
    name: '',
    phone: ''
  };

  myForm: FormGroup;

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.myForm = new FormGroup({
      myNumber: new FormControl('', [CustomValidators.fiveDigitNumberStartingWith(2)])
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.httpClient.post('api/startup/add', this.startup)
      .subscribe(
        response => {
          console.log(response);
          this.sweetAlertService.showSuccess('新增成功', 'success');
          this.dialogRef.close(response);
        },
        error => {
          if (error.error.error === '创业公司已存在') {
            this.sweetAlertService.showError('新增失败', '创业公司已存在', 'error');
          } else {
            this.sweetAlertService.showError('新增失败', '', 'error');
          }
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
