"use client";
import React, { useState } from "react";
import { MiceService } from "@/db/schemas/mice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createMiceService,
  updateMiceService,
  deleteMiceService,
} from "@/actions/mice";

interface MiceServicesSettingProps {
  miceServicesData: MiceService[];
}

const emptyForm = {
  ENGtitle: "",
  KOtitle: "",
  ENGcontent: "",
  KOcontent: "",
};

const MiceServicesSetting = ({
  miceServicesData,
}: MiceServicesSettingProps) => {
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Handle create form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit form change
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Create new service
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createMiceService(form);
      if (result.success) {
        setForm(emptyForm);
        window.location.reload();
      } else {
        alert(result.error || "Failed to create service");
      }
    } catch {
      alert("An error occurred while creating the service");
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing
  const startEdit = (service: MiceService) => {
    setEditingId(service.id);
    setEditForm({
      ENGtitle: service.ENGtitle,
      KOtitle: service.KOtitle,
      ENGcontent: service.ENGcontent,
      KOcontent: service.KOcontent,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  // Update service
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsLoading(true);
    try {
      const result = await updateMiceService(editingId, editForm);
      if (result.success) {
        setEditingId(null);
        setEditForm(emptyForm);
        window.location.reload();
      } else {
        alert(result.error || "Failed to update service");
      }
    } catch {
      alert("An error occurred while updating the service");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete service
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeletingId(id);
    try {
      const result = await deleteMiceService(id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Failed to delete service");
      }
    } catch {
      alert("An error occurred while deleting the service");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">MICE Services Settings</h2>
      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 space-y-4 p-4 border rounded-lg bg-gray-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ENGtitle">English Title</Label>
            <Input
              id="ENGtitle"
              name="ENGtitle"
              value={form.ENGtitle}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="KOtitle">Korean Title</Label>
            <Input
              id="KOtitle"
              name="KOtitle"
              value={form.KOtitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="ENGcontent">English Content</Label>
            <Textarea
              id="ENGcontent"
              name="ENGcontent"
              value={form.ENGcontent}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="KOcontent">Korean Content</Label>
            <Textarea
              id="KOcontent"
              name="KOcontent"
              value={form.KOcontent}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Service"}
        </Button>
      </form>

      {/* List of Services */}
      <div className="space-y-6">
        {miceServicesData.length === 0 && (
          <div className="text-gray-500 text-center py-8 border rounded-lg">
            No MICE services yet.
          </div>
        )}
        {miceServicesData.map((service) => (
          <div
            key={service.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            {editingId === service.id ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-ENGtitle">English Title</Label>
                    <Input
                      id="edit-ENGtitle"
                      name="ENGtitle"
                      value={editForm.ENGtitle}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-KOtitle">Korean Title</Label>
                    <Input
                      id="edit-KOtitle"
                      name="KOtitle"
                      value={editForm.KOtitle}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="edit-ENGcontent">English Content</Label>
                    <Textarea
                      id="edit-ENGcontent"
                      name="ENGcontent"
                      value={editForm.ENGcontent}
                      onChange={handleEditChange}
                      required
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="edit-KOcontent">Korean Content</Label>
                    <Textarea
                      id="edit-KOcontent"
                      name="KOcontent"
                      value={editForm.KOcontent}
                      onChange={handleEditChange}
                      required
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div className="font-semibold text-lg">
                    {service.ENGtitle} / {service.KOtitle}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                    >
                      {deletingId === service.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
                <div className="mb-1">
                  <span className="font-medium">ENG:</span> {service.ENGcontent}
                </div>
                <div>
                  <span className="font-medium">KOR:</span> {service.KOcontent}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiceServicesSetting;
