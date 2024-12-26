import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../../service/shared.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Incubator} from '../../entity/incubator';
import {CustomValidators} from "../../custom.validators";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  nameFormControl = new FormControl('', Validators.required);

  incubator = {
    id: 1,
    ino: '',
    name: '',
    legal_name: '',
    address: '',
    phone: ''
  };

  incubators: Incubator;

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    ino: new FormControl(null, [
      Validators.required,
      CustomValidators.fiveDigitNumberStartingWith(4)
    ]),
    name: this.nameFormControl,
    legal_name: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
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
    console.log(this.incubator.name);
    this.httpClient.post<Incubator>(`api/incubator/edit/${id}`, id)
      .subscribe(incubator => {
        console.log('incubator', incubator);
        this.incubators = incubator;
        this.nameFormControl.patchValue(incubator[0].name);
        this.formGroup.get('ino').setValue(incubator[0].ino);
        this.formGroup.get('legal_name').setValue(incubator[0].legal_name);
        this.formGroup.get('address').setValue(incubator[0].address);
        this.formGroup.get('phone').setValue(incubator[0].phone);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    const incubatorId = this.incubators[0].id;
    const ino = this.incubators[0].ino;
    const name = this.nameFormControl.value;
    // tslint:disable-next-line:variable-name
    const legal_name = this.formGroup.get('legal_name').value;
    const address = this.formGroup.get('address').value;
    const phone = this.formGroup.get('phone').value;
    const incubator = new Incubator(
      incubatorId,
      ino,
      name,
      legal_name,
      address,
      phone
    );
    console.log(incubator);
    this.httpClient.put<Incubator>(`/api/incubator/update`, incubator)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(incubator);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '用户已存在') {
            this.sweetAlertService.showError('编辑失败', '孵化公司已存在', 'error');
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
