import {
  ThermalPrinter,
  PrinterTypes
} from "node-thermal-printer";

export const printSlip = async (patient) => {

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "tcp://192.168.0.100"
  });

  printer.alignCenter();
  printer.println("CITY CARE HOSPITAL");
  printer.println("Prescription Slip");
  printer.drawLine();

  printer.println(`Token: ${patient.tokenNumber}`);
  printer.println(`Name: ${patient.fullName}`);
  printer.println(`Department: ${patient.department}`);
  printer.println(`Doctor: ${patient.doctor}`);

  printer.drawLine();
  printer.println("Please wait for your turn");

  printer.cut();

  await printer.execute();
};