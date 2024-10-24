import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { TabMenuModule } from 'primeng/tabmenu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { ChipsModule } from 'primeng/chips';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { StepsModule } from 'primeng/steps';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EditorModule } from 'primeng/editor';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { DataViewModule } from 'primeng/dataview';
import { GalleriaModule } from 'primeng/galleria';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ChipModule } from 'primeng/chip';
// import { ChartModule } from 'primeng/chart';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';

const primeItems = [
  InputTextModule,
  CardModule,
  ButtonModule,
  TableModule,
  DynamicDialogModule,
  DialogModule,
  SidebarModule,
  TabMenuModule,
  MultiSelectModule,
  TooltipModule,
  ConfirmPopupModule,
  InputTextareaModule,
  CalendarModule,
  DropdownModule,
  DividerModule,
  ChipsModule,
  TabViewModule,
  TreeModule,
  StepsModule,
  PanelModule,
  AccordionModule,
  AvatarModule,
  ImageModule,
  FileUploadModule,
  CheckboxModule,
  ConfirmDialogModule,
  CardModule,
  FieldsetModule,
  ProgressSpinnerModule,
  InputSwitchModule,
  OverlayPanelModule,
  RadioButtonModule,
  EditorModule,
  ToolbarModule,
  BreadcrumbModule,
  InputNumberModule,
  PasswordModule,
  DataViewModule,
  GalleriaModule,
  MenubarModule,
  ToastModule,
  PanelMenuModule,
  TieredMenuModule,
  ChipModule,
  // ChartModule,
  BadgeModule, RippleModule

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[primeItems]
})
export class PrimengModule { }
