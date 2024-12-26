import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../entity/project';
import {CustomValidators} from '../../custom.validators';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../../service/shared.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Startup} from "../../entity/startup";
import {Investors} from "../../entity/investors";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  project = {
    id: 1,
    num: '',
    startup_id: '',
    investor_id: '',
    incubator_id: ''
  };

  projects: Project;

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    num: new FormControl(null, [
      Validators.required,
      CustomValidators.fiveDigitNumberStartingWith(5)
    ]),
    startup_id: new FormControl(null, Validators.required),
    investor_id: new FormControl(null, Validators.required),
    incubator_id: new FormControl(null, Validators.required),
  });

  startups: Startup[];
  investors: Investors[];
  incubators: any[];

  constructor(private activatedRoute: ActivatedRoute,
              private httpClient: HttpClient,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
    this.httpClient.post<Project>(`api/project/edit/${id}`, id)
      .subscribe(project => {
        console.log('project', project);
        this.projects = project;
        this.formGroup.get('num').setValue(project[0].num);
        this.formGroup.get('startup_id').setValue(project[0].startup_id);
        this.formGroup.get('investor_id').setValue(project[0].investors_id);
        this.formGroup.get('incubator_id').setValue(project[0].incubatorEmployee.incubator_id);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    const projectId = this.projects[0].id;
    const num = this.formGroup.get('num').value;
    // tslint:disable-next-line:variable-name
    const startup_id = this.formGroup.get('startup_id').value;
    // tslint:disable-next-line:variable-name
    const investor_id = this.formGroup.get('investor_id').value;
    // tslint:disable-next-line:variable-name
    const incubator_id = this.formGroup.get('incubator_id').value;
    const project = new Project(
      projectId,
      num,
      startup_id,
      investor_id,
      incubator_id,
    );
    console.log(project);
    this.httpClient.put<Project>(`/api/project/update`, project)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(project);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '项目已存在') {
            this.sweetAlertService.showError('编辑失败', '项目已存在', 'error');
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
