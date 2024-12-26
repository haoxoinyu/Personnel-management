import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Startup} from '../../entity/startup';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../../service/shared.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomValidators} from "../../custom.validators";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  nameFormControl = new FormControl('', Validators.required);

  startup = {
    id: 1,
    sno: '',
    name: '',
    phone: ''
  };

  startups: Startup;

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    sno: new FormControl(null, [
      Validators.required,
      CustomValidators.fiveDigitNumberStartingWith(2)
    ]),
    name: this.nameFormControl,
    phone: new FormControl(null, Validators.required),
  });
  constructor(private activatedRoute: ActivatedRoute,
              private httpClient: HttpClient,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.loadById(+id);
  }

  /**
   * 由后台加载预编辑的班级.
   * @param id 班级id.
   */
  loadById(id: number): void {
    console.log('loadById');
    id = this.sharedService.getId();
    console.log(id);
    this.formGroup.get('id').setValue(id);
    console.log(this.formGroup.value);
    console.log(this.startup.name);
    this.httpClient.post<Startup>(`api/startup/edit/${id}`, id)
      .subscribe(startup => {
        console.log('startup', startup);
        this.startups = startup;
        this.nameFormControl.patchValue(startup[0].name);
        this.formGroup.get('sno').setValue(startup[0].sno);
        this.formGroup.get('phone').setValue(startup[0].phone);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    const startupId = this.startups[0].id;
    const sno = this.formGroup.get('sno').value;
    const name = this.nameFormControl.value;
    const phone = this.formGroup.get('phone').value;
    const startup = new Startup(
      startupId,
      sno,
      name,
      phone
    );
    console.log(startup);
    this.httpClient.put<Startup>(`/api/startup/update`, startup)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(startup);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '用户已存在') {
            this.sweetAlertService.showError('编辑失败', '创业公司已存在', 'error');
          } else {
            this.sweetAlertService.showError('编辑失败', '', 'error');
          }
          console.log(error);
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
