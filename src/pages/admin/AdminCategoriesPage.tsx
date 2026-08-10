// Categories are global (not scoped to a seller), and admins have the same
// create/update/delete permissions as sellers on this resource, so we reuse
// the exact same page rather than duplicating ~250 lines of identical logic.
export { default } from "../seller/SellerCategoriesPage";
