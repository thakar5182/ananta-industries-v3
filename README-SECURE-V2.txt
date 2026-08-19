# Ananta Industries Secure GST Business System v2.1.0

Windows/Electron business application with restricted biller access, inventory, billing, quotations, purchases, clients, finance, reports, audit logs and secure local storage.

## v2.1.0 changes

- Replaced the old text/placeholder branding with the supplied Ananta Industries logo on login, sidebar, invoice preview, PDF invoice, signature block and invoice footer.
- Colourful blue GST tax invoice designed for A4 print/PDF.
- GST invoice fields aligned to Rule 46 essentials: supplier identity/GSTIN/address, financial-year invoice number, date, recipient address/GSTIN, HSN, description, quantity/unit, gross/taxable value, tax rate, tax amount, place of supply, reverse charge and authorized-signatory area.
- CGST + SGST is used for same-state sales and IGST for inter-state sales.
- Added amount-in-words, state code, delivery address, bank details and invoice terms.
- Supplier GSTIN/address/state settings are required before a new GST invoice can be generated so the app does not silently produce an incomplete tax invoice.
- No fake IRN or GST QR code is generated. If e-invoicing applies to the business, the invoice must still be registered on an authorised Invoice Registration Portal and the official IRN/QR used.
- Biller navigation remains limited to Bills and Inventory; admin-only business/financial modules remain server protected.
- Website CMS remains removed.

## First setup

1. Login as admin.
2. Open **Settings**.
3. Enter the exact legal company name, registered address, GSTIN, state, state code, PIN and optional bank/signatory details from the GST registration/business records.
4. Review client GSTIN, billing address, state and state code before issuing invoices.
5. Change the default account passwords before production use.

## Run

```powershell
npm install
npm run verify
npm run desktop
```

## Build Windows installer

```powershell
npm run build:win
```

The installer is created under `dist`.

## Default demo accounts

- Admin: `admin` / `admin123`
- Biller: `biller` / `bill123`

Change both passwords before production use.
