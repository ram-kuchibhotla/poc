import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { default as volvoSchema } from './schema.model.json';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { transactions } from './data';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  transactions: any;
  orderValidationForm: UntypedFormGroup;
  transferValidationForm: UntypedFormGroup;
  orderSubmit: boolean;
  transferSubmit: boolean;
  fields: any[] = [];

  constructor(private modalService: NgbModal, public formBuilder: UntypedFormBuilder) {
  }

  ngOnInit() {
    /**
     * Type validation form
    */
    this.orderValidationForm = this.formBuilder.group({});
    for (const field of Object.keys(volvoSchema.properties.Cmr.properties)) {
      const type = Object.values(volvoSchema.properties.Cmr.properties[field])[0];
      this.fields.push({
        name: field,
        type: type === 'string' ? 'text' : type,
        value: ''
      });
      this.orderValidationForm.addControl(
        field,
        new FormControl({value: '', disabled:  field === 'CmrID'}, Object.values(volvoSchema.properties.Cmr.required).includes(field) ? [Validators.required] : [])
      );
    }

    this.transferValidationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    });

    this.orderSubmit = false;
    this.transferSubmit = false;

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.transactions = transactions;
  }


  /**
  * Open modal
  * @param content modal content
  */
  openOrderModal(content: any, data: any) {
    this.orderSubmit = false;
    this.fields.forEach(a => a.value = data[a.name] ? data[a.name] : '');
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  openTransferModal(transfer: any) {
    this.transferSubmit = false;
    this.modalService.open(transfer, { size: 'lg', centered: true });
  }


  get type() {
    return this.orderValidationForm.controls;
  }

  get transfer() {
    return this.transferValidationForm.controls;
  }


  submitOrderForm() {
    this.orderSubmit = true;
    let selectedTransaction: any = {};

    Object.keys(this.orderValidationForm.controls).forEach(key => {
      selectedTransaction[key] = this.orderValidationForm.get(key).value;
    });

    let indexToUpdate = this.transactions.findIndex(item => item.CmrID === selectedTransaction.CmrID);
    this.transactions[indexToUpdate] = selectedTransaction;

    console.log("2");
    console.log(selectedTransaction);

    this.modalService.dismissAll();
  }

  submitTransferForm() {
    this.transferSubmit = true;
  }
}