import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAdminUsers,
  selectAdminUsersError,
  selectAdminUsersStatus,
} from "../../features/adminUsers/adminUserSelectors";
import {
  fetchUsers,
  setSellerApproval,
  toggleUserActive,
} from "../../features/adminUsers/adminUserThunk";
import { clearAdminUserError } from "../../features/adminUsers/adminUserSlice";
import type {
  AdminUser,
  ApprovalStatus,
  UserRole,
} from "../../features/adminUsers/adminUserTypes";

const ROLE_TABS: { label: string; value: UserRole | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Buyers", value: "BUYER" },
  { label: "Sellers", value: "SELLER" },
  { label: "Admins", value: "ADMIN" },
];

const APPROVAL_STYLES: Record<ApprovalStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  APPROVED: "bg-green-50 text-green-600 border-green-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
};

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);
  const status = useAppSelector(selectAdminUsersStatus);
  const error = useAppSelector(selectAdminUsersError);

  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== "ALL" && user.role !== roleFilter) return false;
      if (pendingOnly && user.approval_status !== "PENDING") return false;
      return true;
    });
  }, [users, roleFilter, pendingOnly]);

  async function handleApproval(user: AdminUser, action: "APPROVE" | "REJECT") {
    setBusyId(user.id);
    await dispatch(setSellerApproval({ id: user.id, action }));
    setBusyId(null);
  }

  async function handleToggleActive(user: AdminUser) {
    const verb = user.is_active ? "suspend" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${verb} ${user.email}?`)) return;
    setBusyId(user.id);
    await dispatch(toggleUserActive(user.id));
    setBusyId(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Approve pending sellers and manage account access.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setRoleFilter(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              roleFilter === tab.value
                ? "bg-green-600 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <label className="ml-2 flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={(e) => setPendingOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          Pending approval only
        </label>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearAdminUserError())}>
            ✕
          </button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && filteredUsers.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No users match this filter.
        </p>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Approval
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Account
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const isBusy = busyId === user.id;
                return (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500">{user.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${APPROVAL_STYLES[user.approval_status]}`}
                      >
                        {user.approval_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {user.role === "SELLER" &&
                          user.approval_status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleApproval(user, "APPROVE")}
                                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleApproval(user, "REJECT")}
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        {user.role !== "ADMIN" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleActive(user)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                          >
                            {user.is_active ? "Suspend" : "Reactivate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
