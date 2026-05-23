"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  AlertCircle,
  RefreshCw,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import InviteStaffForm from "@/components/forms/InviteStaffForm";
import apiRequest from "@/lib/api";
import { getToken } from "@/lib/auth";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

type Toast = { type: "success" | "error"; message: string } | null;

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<StaffMember | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/staff", {
        method: "GET",
      });
      setStaff(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    setConfirmDelete(null);
    try {
      await apiRequest(`/staff/${confirmDelete.id}`, { method: "DELETE" });
      await fetchStaff();
      showToast("success", `"${confirmDelete.name}" removed successfully.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to remove staff member.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";
      case "admin":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "manager":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading staff members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h3 className="mb-1 text-lg font-semibold text-red-700 dark:text-red-400">
              Error loading staff
            </h3>
            <p className="mb-5 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
            <Button
              onClick={() => fetchStaff()}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-600" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-sm border-zinc-200 shadow-2xl dark:border-zinc-700">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-1 text-base font-semibold">
                Remove staff member?
              </h3>
              <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {confirmDelete.name}
                </span>{" "}
                will lose access to this organization. This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your team members — {staff.length} staff member
            {staff.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          className="shrink-0 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
          onClick={() => setIsInviteOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      {/* Stats */}
      {staff.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Total Staff
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {staff.length}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-2.5 dark:bg-orange-950/20">
                <Users className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Roles
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {new Set(staff.map((s) => s.role)).size}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-2.5 dark:bg-purple-950/20">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Admins & Owners
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {
                    staff.filter(
                      (s) => s.role === "ADMIN" || s.role === "OWNER",
                    ).length
                  }
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/20">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            All staff members
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <Users className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                No staff members yet
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Invite your first team member to get started.
              </p>
              <Button
                className="mt-5 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                onClick={() => setIsInviteOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Invite Staff
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <TableHead className="h-11 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Name
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Email
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Role
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Date Joined
                    </TableHead>
                    <TableHead className="h-11 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow
                      key={member.id}
                      className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
                    >
                      <TableCell className="py-4 pl-6 font-medium text-zinc-900 dark:text-zinc-100">
                        {member.name}
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                        {member.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRoleBadgeColor(member.role)}`}
                        >
                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1).toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
                        {formatDate(member.createdAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === member.id}
                          onClick={() => setConfirmDelete(member)}
                          className="h-8 w-8 p-0 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <InviteStaffForm
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => {
          fetchStaff();
          setIsInviteOpen(false);
          showToast("success", "Invitation sent successfully!");
        }}
      />
    </div>
  );
}
