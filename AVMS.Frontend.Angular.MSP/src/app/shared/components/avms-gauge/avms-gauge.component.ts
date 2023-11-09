import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { first, timer } from 'rxjs';

@Component({
  selector: 'app-avms-gauge',
  templateUrl: './avms-gauge.component.html',
  styleUrls: ['./avms-gauge.component.scss']
})
export class AvmsGaugeComponent implements AfterViewInit, OnChanges {
  @Input() value: number = 100;
  @Input() text: string = '';
  @Input() text1: string = '';
  @Input() text2: string = '';
  @Input() color: string = 'blue';
  @Input() circleColor: string = '#263D92';
  @Input() triggerChange: object = {};

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement> | undefined;

  public ctx: CanvasRenderingContext2D | undefined;

  draw(): void {
    const ctx = this.ctx!;
    ctx.clearRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);

    const arcX = 80;
    const arcY = 80;
    const start = 1.5 * Math.PI;
    const end = start + (2 * Math.PI * this.value / 100);
    const pctText = `${this.value}%`;

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.circleColor;
    ctx.arc(arcX, arcY, 65, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 9;
    ctx.strokeStyle = this.color;
    ctx.arc(arcX, arcY, 72, start, end);
    ctx.stroke();

    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "Normal 600 40px Poppins";
    ctx.fillStyle = '#263D92';
    ctx.fillText(pctText, arcX, arcY - 10);
    
    ctx.font = "Normal 600 12px Poppins";
    ctx.fillStyle = '#263D92';
    ctx.fillText(this.text, arcX, arcY + 15);

    ctx.font = "Normal 600 14px Poppins";
    ctx.fillStyle = '#263D92';
    ctx.fillText(this.text1, arcX, arcY + 15);

    ctx.font = "Normal 600 14px Poppins";
    ctx.fillStyle = '#263D92';
    ctx.fillText(this.text2, arcX, arcY + 30);
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas!.nativeElement.getContext('2d')!;
    timer(1000).pipe(first()).subscribe(() => this.draw());
  }

  ngOnChanges(): void {
    if (this.ctx) {
      this.draw();
    }
  }

}
