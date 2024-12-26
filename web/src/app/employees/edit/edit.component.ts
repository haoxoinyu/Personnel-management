import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Employees} from '../../entity/employees';
import {CustomValidators} from '../../custom.validators';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../../service/shared.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Incubator} from '../../entity/incubator';
import {Startup} from '../../entity/startup';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  nameFormControl = new FormControl('', Validators.required);

  employees = {
    id: 1,
    eno: '',
    cardid: '',
    name: '',
    gender: '',
    phone: '',
    company: ''
  };

  employeess: Employees;
  incubators: Incubator[];
  startups: Startup[];

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    eno: new FormControl(null, [
      Validators.required,
      CustomValidators.fiveDigitNumberStartingWith(3)
    ]),
    cardid: new FormControl(null, Validators.required),
    name: this.nameFormControl,
    gender: new FormControl(null, Validators.required),
    phone: new FormControl(null, Validators.required),
    company: new FormControl(null, Validators.required)
  });
  constructor(private activatedRoute: ActivatedRoute,
              private httpClient: HttpClient,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
    console.log(this.employees.name);
    this.httpClient.post<Employees>(`api/employees/edit/${id}`, id)
      .subscribe(employees => {
        console.log('employees', employees);
        this.employeess = employees;
        if (employees[0].gender === '男') {
          this.formGroup.get('gender').setValue(0);
        }
        if (employees[0].gender === '女') {
          this.formGroup.get('gender').setValue(1);
        }
        if (employees[0].incubatorEmployee.length > 0) {
          console.log(employees[0].incubatorEmployee);
          const matchedIncubator = this.incubators.find(incubator =>
            incubator.id === employees[0].incubatorEmployee[0].incubator_id
          );
          if (matchedIncubator) {
            this.formGroup.get('company').setValue(matchedIncubator.ino);
          }
        }
        if (employees[0].startupEmployee.length > 0) {
          console.log(employees[0].startupEmployee);
          const matchedStartup = this.startups.find(startup =>
            startup.id === employees[0].startupEmployee[0].startup_id
          );
          if (matchedStartup) {
            this.formGroup.get('company').setValue(matchedStartup.sno);
          }
        }
        this.nameFormControl.patchValue(employees[0].name);
        this.formGroup.get('eno').setValue(employees[0].eno);
        this.formGroup.get('cardid').setValue(employees[0].cardid);
        this.formGroup.get('phone').setValue(employees[0].phone);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    const employeesId = this.employeess[0].id;
    const eno = this.formGroup.get('eno').value;
    const cardid = this.formGroup.get('cardid').value;
    const name = this.nameFormControl.value;
    const gender = this.formGroup.get('gender').value;
    const phone = this.formGroup.get('phone').value;
    const company = this.formGroup.get('company').value;
    const employees = new Employees(
      employeesId,
      eno,
      cardid,
      name,
      gender,
      phone,
      company
    );
    console.log(employees);
    this.httpClient.put<Employees>(`/api/employees/update`, employees)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(employees);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '员工已存在') {
            this.sweetAlertService.showError('编辑失败', '员工已存在', 'error');
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
