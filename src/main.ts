import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { RowGroupingModule, TreeDataModule, RowNumbersModule } from 'ag-grid-enterprise'
import { LicenseManager } from 'ag-grid-enterprise'

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_LICENSE_KEY)
ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule, TreeDataModule, RowNumbersModule])
createApp(App).mount('#app')
