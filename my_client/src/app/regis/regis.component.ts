import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, Validators, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  customValidator,
  passwordValidator,
} from '../Validators/check.validator';
import { User } from '../models/users';
import { UserserviceService } from '../service/userservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regis',
  templateUrl: './regis.component.html',
  styleUrls: ['./regis.component.css'],
})
export class RegisComponent implements OnInit {
  public regForm: any;
  user: User = new User();
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _service: UserserviceService,
    private _toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.regForm = this._formBuilder.group(
      {
        phone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(
              /((032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)+([0-9]{7})\b)/g
            ),
          ],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            customValidator(/\@|\#|\%|\$|\^|\&/g),
          ],
        ],
        useremail: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required, Validators.minLength(10)]],
        pass: ['', [Validators.required, Validators.minLength(8)]],
        confirmPass: ['', [Validators.required]],
      },
      { validators: passwordValidator }
    );
  }

  submitData(form: NgForm) {
    this._service.postUser(this.user).subscribe((res) => {
      let resData = JSON.parse(JSON.stringify(res));
      if (resData.message === 'success') {
        this._toast.success('Đăng ký thành công!', 'ĐĂNG KÝ');
        setTimeout(() => {
          this.router.navigate(['/account', this.user.phone]);
        }, 0);
      } else {
        this._toast.error('Tài khoản đã tồn tại!', 'ĐĂNG KÝ');
      }
    });
  }
  onFeatureInDevelopment() {
    this._toast.warning('Chức năng đang phát triển!', 'THÔNG BÁO');
  }

  get phone() {
    return this.regForm.controls['phone'];
  }
  get username() {
    return this.regForm.controls['username'];
  }
  get useremail() {
    return this.regForm.controls['useremail'];
  }
  get address() {
    return this.regForm.controls['address'];
  }
  get pass() {
    return this.regForm.controls['pass'];
  }
  get confirmPass() {
    return this.regForm.controls['confirmPass'];
  }
}
