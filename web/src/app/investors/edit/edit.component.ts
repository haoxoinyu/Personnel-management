import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Investors} from '../../entity/investors';
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

  investors = {
    id: 1,
    num: '',
    name: '',
    phone: ''
  };

  investorss: Investors;

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    num: new FormControl(null, [
      Validators.required,
      CustomValidators.fiveDigitNumberStartingWith(4)
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
    console.log(this.investors.name);
    this.httpClient.post<Investors>(`api/investors/edit/${id}`, id)
      .subscribe(investors => {
        console.log('investors', investors);
        this.investorss = investors;
        this.nameFormControl.patchValue(investors[0].name);
        this.formGroup.get('num').setValue(investors[0].num);
        this.formGroup.get('phone').setValue(investors[0].phone);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    const investorsId = this.investorss[0].id;
    const num = this.formGroup.get('num').value;
    const name = this.nameFormControl.value;
    const phone = this.formGroup.get('phone').value;
    const investors = new Investors(
      investorsId,
      num,
      name,
      phone
    );
    console.log(investors);
    this.httpClient.put<Investors>(`/api/investors/update`, investors)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(investors);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '投资方已存在') {
            this.sweetAlertService.showError('编辑失败', '投资方存在', 'error');
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
