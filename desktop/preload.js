const {contextBridge,ipcRenderer}=require('electron');contextBridge.exposeInMainWorld('desktopAPI',{saveInvoicePDF:(name,html)=>ipcRenderer.invoke('save-invoice-pdf',{name,html})});
