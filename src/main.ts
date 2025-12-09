import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { RowGroupingModule } from 'ag-grid-enterprise'
import { LicenseManager } from 'ag-grid-enterprise'

const agLicenseKey = '[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-115010}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{8 January 2026}____[v3]_[0102]_MTc2NzgzMDQwMDAwMA==3093b9a9c04d034bc97b71a0b35bf226'

LicenseManager.setLicenseKey(agLicenseKey)
ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule])
createApp(App).mount('#app')
