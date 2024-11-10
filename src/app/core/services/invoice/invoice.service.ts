import { Injectable, inject } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { ISaleItemsResponse } from '../../interfaces/sales/sale.interface';
import { UserStore } from '../../signal-store/user.store';
import { DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  readonly uStore = inject(UserStore);
  constructor() { }


  async printBill(data: ISaleItemsResponse) {
    const date = new Date(data.date ).toLocaleString('en-GB');
    const canvas = document.createElement('canvas');
    const id:string = data.id.toString();
    await JsBarcode(canvas, id, {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: false,
      margin: 0
    });

    const barcodeImage = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Receipt</title>
          <meta charset="utf-8">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js"></script>
          <style>
            @page {
              margin: 0;
              size: 80mm auto;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 2mm;
              width: 76mm;
              font-size: 12px;
            }

            .header {
              text-align: center;
              margin-bottom: 1mm;
            }

            .header h2 {
              font-size: 25px;
              margin: 0 0 1mm 0;
            }

            .header p {
              margin: 0;
              font-size: 12px;
              line-height: 1.2;
            }

            .invoice-details {
              margin-bottom: 1mm;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 2mm 0;
            }

            .invoice-details p {
              margin: 0;
              line-height: 1.5;
            }

            .topic {
              margin-bottom: 1mm;
              border-bottom: 1px dashed #000;
              padding: 1mm 0;
             
            }

            .topic p{
              margin: 0;
              display: flex;
              justify-content: center;
            }

            .items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 3mm;
              font-size: 12px;
            }

            .items th {
              text-align: left;
              padding: 1mm 0;
              border-bottom: 1px solid #000;
            }

            .items td {
              padding: 1mm 0;
              height:5px
            }

            .items .desc { width: 30%; }
            .items .qty { width: 20%; }
            .items .price { width: 25%; }
            .items .total { width: 25%; }
            .items .name { width: 100%; }

            .totals {
              margin-top: 1mm;
              border-top: 1px dashed #000;
              padding-top: 2mm;
            }

            .totals p {
              margin: 0;
              display: flex;
              justify-content: space-between;
              line-height: 1.5;
            }

            .total-line {
              font-weight: bold;
              font-size: 17px;
            }

            .footer {
              text-align: center;
              margin-top: 1mm;
              padding-top: 2mm;
              border-top: 1px dashed #000;
              font-size: 11px;
            }

            .footer p {
              margin: 1mm 0;
            }

            .barcode-section {
              text-align: center;
              margin-top: 2mm;
              padding-top: 3mm;
              border-top: 1px dashed #000;
            }

            #barcode {
              max-width: 100%;
              height: 40px;
            }

            .barcode-number {
              font-size: 10px;
              margin-top: 1mm;
              text-align: center;
            }

            .cut-line {
              border-bottom: 1px dashed #000;
              margin: 5mm 0;
              position: relative;
            }

            .cut-line:after {
              content: "✂";
              position: absolute;
              left: -4mm;
              top: -2.5mm;
              font-size: 12px;
            }

            
            .product-name-cell {
              font-size: 10px;
            }

            .details-row td {
             height:2px
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${this.uStore.showroom()}</h2>
            <p>${this.uStore.user().showroom?.location}</p>
            <p>${this.uStore.user().showroom?.address}</p>
            <p>Tel: ${this.uStore.user().showroom?.location}</p>
          </div>

          <div class="invoice-details">
            <p>Invoice No: ${data.id}</p>
            <p>Date & Time: ${date}</p>
            ${this.uStore ? `<p>Cashier: ${this.uStore.user().firstName}</p>` : ''}
            ${data.paymentMethod ? `<p>Payment: ${data.paymentMethod}</p>` : ''}
          </div>

          <div class="topic">
          <p class="total-line">INVOICE</p>
        </div>


          <table class="items">
          <thead>
            <tr>
              <th class="desc">ITEM</th>
              <th class="price">PRICE</th>
              <th class="qty">QTY</th>
              <th class="total">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${data.saleItems.map((item,index)=> `
              <!-- Product name row with merged columns -->
              <tr class="product-name-row">
              <td colspan="0.5" class="product-name-cell">${index+1 }</td>
                <td colspan="3.5" class="product-name-cell">${item.item?.name.slice(0,30)}</td>
              </tr>
              <!-- Details row -->
              <tr class="details-row">
                <td class="desc">${item.item?.id}</td>
                <td class="price">${item.unitPrice?.toFixed(2)}</td>
                <td class="qty">${item.quantity}</td>
                <td class="total">${item.totalPrice?.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

         
          <div class="totals">
            <p><span>Gross Amount:</span> <span>${data.netAmount.toFixed(2)}</span></p>
            <p><span>Total Discount:</span> <span></span></p>
            <p class="total-line"><span>NET AMOUNT:</span> <span>${data.netAmount.toFixed(2)}</span></p>
          </div>

          <div class="totals">
          <p><span>Cash:</span> <span>${data.payment.toFixed(2)}</span></p>
          <p><span>Items:</span> <span>${data.itemsCount}</span></p>
          <p><span>Total Quantity:</span> <span>${data.totalQty}</span></p>
        </div>


          <div class="footer">
            <p>Thank you for your Shopping @${this.uStore.showroom()}!</p>
            <p>Any price variation to MPR will be refunded within 7 days of purchace till sliip/product required for refund</p>
            <p>Come Again</p>
            <p>${this.uStore.showroom()}</p>
          </div>

          <div class="barcode-section">
          <img src="${barcodeImage}" alt="Barcode" style="width: 100%; max-height: 50px;">
          <div class="barcode-number">${data.id}</div>
        </div>

        <div class="barcode-number">Powered by CsA-Dev-Solution (Pvt) Ltd</div>
          <div class="cut-line"></div>

          <script>
            // Generate barcode after the page loads
            window.onload = function() {
              JsBarcode("#barcode", "${data.id}", {
                format: "CODE128",
                width: 1.5,
                height: 28,
                displayValue: false,
                margin: 0
              });

              // Print after a small delay to ensure barcode is rendered
              setTimeout(() => {
                window.print();
                window.onafterprint = () => {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

}
