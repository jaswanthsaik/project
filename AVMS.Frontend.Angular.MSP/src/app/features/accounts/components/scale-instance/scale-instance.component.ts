import { Component, Input, OnInit } from '@angular/core';
import { InstanceSize } from '../../models/instance-size';
import { AccountsService } from '../../services/accounts.service';

@Component({
  selector: 'app-scale-instance',
  templateUrl: './scale-instance.component.html',
  styleUrls: ['./scale-instance.component.scss']
})
export class ScaleInstanceComponent implements OnInit {
  selectedSize: string = '0';
  instanceName: string = '';
  previousSize: string = '';
  previousCores: string = '';
  previousMemory: string = '';

  scaleOptions = [
    { id: '0', description: 'Select a size to scale the instance' },
  ];

  constructor(
    private accountsService: AccountsService,
  ) {
    this.instanceName = this.accountsService.instanceName;
    this.selectedSize = this.accountsService.size;
    this.previousSize = this.accountsService.previousSize;
    this.previousCores = this.accountsService.previousCores;
    this.previousMemory = this.accountsService.previousMemory;
  }

  scaleChanged(size: string): void {
    this.accountsService.size = size;
  }

  ngOnInit(): void {
    this.accountsService.instanceSizes.forEach(size => {
      this.scaleOptions.push({ id: size.name, description: size.name + ' (' + size.cores + ' VCores -' + (parseInt(size.memory_megabyte)/1024).toFixed(2).toString() + ' GB)' });
    }
    );
  }

}
