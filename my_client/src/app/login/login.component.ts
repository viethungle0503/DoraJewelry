import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/users';
import { UserserviceService } from '../service/userservice.service';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { FavoriteService } from '../service/favorite.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public logForm: any;
  user: User = new User();
  unique_id: any;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _service: UserserviceService,
    private _shoppingCart: ShoppingCartService,
    private _favorite: FavoriteService,
    private _toast: ToastrService,
    private router: Router
  ) {
    this._service.getLoginCookies().subscribe({
      next: (res) => {
        let resData = JSON.parse(JSON.stringify(res));
        if (resData.message != 'fail') {
          this.user['phone'] = resData.phone;
          this.user['pass'] = resData.pass;
        } else {
          console.log('No cookies availble');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit(): void {
    this.logForm = this._formBuilder.group({
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
      pass: ['', [Validators.required]],
    });
  }

  loginUser(form?: NgForm) {
    this._service.logUser(this.user).subscribe((res) => {
      let resData = JSON.parse(res);
      if (resData.message === 'success') {
        this._toast.success('Đăng nhập thành công!', 'ĐĂNG NHẬP');
        setTimeout(() => {
          this._shoppingCart.setTotalItems();
          this._favorite.setTotalFavorites();
          this.router.navigate(['account', resData.user.phone]);
        }, 0);
      }
      if (resData.message === 'unsuccess') {
        this._toast.error('Sai mật khẩu!', 'ĐĂNG NHẬP');
      }
      if (resData.message === 'fail') {
        this._toast.error('Số điện thoại chưa được đăng ký!', 'ĐĂNG NHẬP');
      }
    });
  }
  onFeatureInDevelopment() {
    this._toast.warning('Chức năng đang phát triển!', 'THÔNG BÁO');
  }
  get phone() {
    return this.logForm.controls['phone'];
  }
  get pass() {
    return this.logForm.controls['pass'];
  }
}
