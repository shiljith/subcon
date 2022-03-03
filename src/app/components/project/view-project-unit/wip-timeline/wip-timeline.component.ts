import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WipService } from 'src/app/services/wip.service';

@Component({
  selector: 'app-wip-timeline',
  templateUrl: './wip-timeline.component.html',
  styleUrls: ['./wip-timeline.component.scss'],
})
export class WipTimelineComponent implements OnInit {
  wipTimelines!: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public wipId: number,
    private wipService: WipService
  ) {}

  ngOnInit(): void {
    this.getWipTimeLine();
  }

  getWipTimeLine() {
    this.wipService.getTimeline(this.wipId).subscribe((res) => {
      this.wipTimelines = res;
    });
  }
}
