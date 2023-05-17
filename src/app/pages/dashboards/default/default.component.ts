import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  transactions: Array<[]>;
  transaction: any;

  typeValidationForm: UntypedFormGroup;
  typesubmit: boolean;

  constructor(private modalService: NgbModal, private configService: ConfigService, public formBuilder: UntypedFormBuilder) {
  }

  ngOnInit() {
    /**
     * Type validation form
    */
    this.typeValidationForm = this.formBuilder.group({
      text: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      digits: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      number: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      alphanum: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      textarea: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpwd: ['', Validators.required]
    });
    this.typesubmit = false;

    /**
     * Fetches the data
     */
    this.fetchData();
  }


  /**
   * Fetches the data
   */
  private fetchData() {
    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
    });
  }


  /**
  * Open modal
  * @param content modal content
  */
  openModal(content: any, transaction: any) {
    this.transaction = transaction;
    this.modalService.open(content, { centered: true });
  }

  get type() {
    return this.typeValidationForm.controls;
  }

  typeSubmit() {
    this.typesubmit = true;
  }
}