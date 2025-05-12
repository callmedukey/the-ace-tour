"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMice, createMice } from "@/actions/mice";
import { useState } from "react";

interface MiceFormProps {
  miceData?: {
    id: string;
    ENGtitle: string;
    KOtitle: string;
    ENGaccentText: string;
    KOaccentText: string;

    KOSuccessfulProjectsTitle: string;
    KOSuccessfulProjectsNumber: number;
    KOSuccessfulProjectsSuffix: string;

    ENGsuccessfulProjectsTitle: string;
    ENGsuccessfulProjectsNumber: number;
    ENGsuccessfulProjectsSuffix: string;

    KOTotalProjectsValueTitle: string;
    KOTotalProjectsValueNumber: number;
    KOTotalProjectsValueSuffix: string;

    ENGtotalProjectsValueTitle: string;
    ENGtotalProjectsValueNumber: number;
    ENGtotalProjectsValueSuffix: string;

    KOTotalParticipantsTitle: string;
    KOTotalParticipantsNumber: number;
    KOTotalParticipantsSuffix: string;

    ENGtotalParticipantsTitle: string;
    ENGtotalParticipantsNumber: number;
    ENGtotalParticipantsSuffix: string;
  };
  isNew?: boolean;
}

export function MiceForm({ miceData, isNew = false }: MiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ENGtitle: miceData?.ENGtitle || "",
    KOtitle: miceData?.KOtitle || "",
    ENGaccentText: miceData?.ENGaccentText || "",
    KOaccentText: miceData?.KOaccentText || "",

    KOSuccessfulProjectsTitle: miceData?.KOSuccessfulProjectsTitle || "",
    KOSuccessfulProjectsNumber: miceData?.KOSuccessfulProjectsNumber || 0,
    KOSuccessfulProjectsSuffix: miceData?.KOSuccessfulProjectsSuffix || "",

    ENGsuccessfulProjectsTitle: miceData?.ENGsuccessfulProjectsTitle || "",
    ENGsuccessfulProjectsNumber: miceData?.ENGsuccessfulProjectsNumber || 0,
    ENGsuccessfulProjectsSuffix: miceData?.ENGsuccessfulProjectsSuffix || "",

    KOTotalProjectsValueTitle: miceData?.KOTotalProjectsValueTitle || "",
    KOTotalProjectsValueNumber: miceData?.KOTotalProjectsValueNumber || 0,
    KOTotalProjectsValueSuffix: miceData?.KOTotalProjectsValueSuffix || "",

    ENGtotalProjectsValueTitle: miceData?.ENGtotalProjectsValueTitle || "",
    ENGtotalProjectsValueNumber: miceData?.ENGtotalProjectsValueNumber || 0,
    ENGtotalProjectsValueSuffix: miceData?.ENGtotalProjectsValueSuffix || "",

    KOTotalParticipantsTitle: miceData?.KOTotalParticipantsTitle || "",
    KOTotalParticipantsNumber: miceData?.KOTotalParticipantsNumber || 0,
    KOTotalParticipantsSuffix: miceData?.KOTotalParticipantsSuffix || "",

    ENGtotalParticipantsTitle: miceData?.ENGtotalParticipantsTitle || "",
    ENGtotalParticipantsNumber: miceData?.ENGtotalParticipantsNumber || 0,
    ENGtotalParticipantsSuffix: miceData?.ENGtotalParticipantsSuffix || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.endsWith("Number") ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;

      if (isNew) {
        result = await createMice(formData);

        // Reload the page to show the newly created MICE
        if (result.success) {
          window.location.reload();
        }
      } else if (miceData) {
        result = await updateMice(miceData.id, formData);
      }

      if (result?.success) {
        // Show success message
        alert(
          isNew ? "MICE created successfully" : "MICE updated successfully"
        );

        // Reset form if creating new
        if (isNew) {
          setFormData({
            ENGtitle: "",
            KOtitle: "",
            ENGaccentText: "",
            KOaccentText: "",

            KOSuccessfulProjectsTitle: "",
            KOSuccessfulProjectsNumber: 0,
            KOSuccessfulProjectsSuffix: "",

            ENGsuccessfulProjectsTitle: "",
            ENGsuccessfulProjectsNumber: 0,
            ENGsuccessfulProjectsSuffix: "",

            KOTotalProjectsValueTitle: "",
            KOTotalProjectsValueNumber: 0,
            KOTotalProjectsValueSuffix: "",

            ENGtotalProjectsValueTitle: "",
            ENGtotalProjectsValueNumber: 0,
            ENGtotalProjectsValueSuffix: "",

            KOTotalParticipantsTitle: "",
            KOTotalParticipantsNumber: 0,
            KOTotalParticipantsSuffix: "",

            ENGtotalParticipantsTitle: "",
            ENGtotalParticipantsNumber: 0,
            ENGtotalParticipantsSuffix: "",
          });
        }
      } else {
        // Show error message
        alert(
          `Failed to ${isNew ? "create" : "update"} MICE: ${result?.error}`
        );
      }
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} MICE:`, error);
      alert(
        `An error occurred while ${isNew ? "creating" : "updating"} the MICE`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      {/* Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ENGtitle">English Title</Label>
          <Input
            id="ENGtitle"
            name="ENGtitle"
            value={formData.ENGtitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOtitle">Korean Title</Label>
          <Input
            id="KOtitle"
            name="KOtitle"
            value={formData.KOtitle}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Accent Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ENGaccentText">English Accent Text</Label>
          <Textarea
            id="ENGaccentText"
            name="ENGaccentText"
            value={formData.ENGaccentText}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOaccentText">Korean Accent Text</Label>
          <Textarea
            id="KOaccentText"
            name="KOaccentText"
            value={formData.KOaccentText}
            onChange={handleChange}
          />
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Successful Projects Stats */}
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Successful Projects Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ENGsuccessfulProjectsTitle">
              ENG Successful Projects Title
            </Label>
            <Input
              id="ENGsuccessfulProjectsTitle"
              name="ENGsuccessfulProjectsTitle"
              value={formData.ENGsuccessfulProjectsTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOSuccessfulProjectsTitle">
              KO Successful Projects Title
            </Label>
            <Input
              id="KOSuccessfulProjectsTitle"
              name="KOSuccessfulProjectsTitle"
              value={formData.KOSuccessfulProjectsTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ENGsuccessfulProjectsNumber">
              ENG Successful Projects Number
            </Label>
            <Input
              id="ENGsuccessfulProjectsNumber"
              name="ENGsuccessfulProjectsNumber"
              type="number"
              min="0"
              value={formData.ENGsuccessfulProjectsNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOSuccessfulProjectsNumber">
              KO Successful Projects Number
            </Label>
            <Input
              id="KOSuccessfulProjectsNumber"
              name="KOSuccessfulProjectsNumber"
              type="number"
              min="0"
              value={formData.KOSuccessfulProjectsNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ENGsuccessfulProjectsSuffix">
              ENG Successful Projects Suffix
            </Label>
            <Input
              id="ENGsuccessfulProjectsSuffix"
              name="ENGsuccessfulProjectsSuffix"
              value={formData.ENGsuccessfulProjectsSuffix}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOSuccessfulProjectsSuffix">
              KO Successful Projects Suffix
            </Label>
            <Input
              id="KOSuccessfulProjectsSuffix"
              name="KOSuccessfulProjectsSuffix"
              value={formData.KOSuccessfulProjectsSuffix}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Total Projects Value Stats */}
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Total Projects Value Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ENGtotalProjectsValueTitle">
              ENG Total Projects Value Title
            </Label>
            <Input
              id="ENGtotalProjectsValueTitle"
              name="ENGtotalProjectsValueTitle"
              value={formData.ENGtotalProjectsValueTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOTotalProjectsValueTitle">
              KO Total Projects Value Title
            </Label>
            <Input
              id="KOTotalProjectsValueTitle"
              name="KOTotalProjectsValueTitle"
              value={formData.KOTotalProjectsValueTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ENGtotalProjectsValueNumber">
              ENG Total Projects Value Number
            </Label>
            <Input
              id="ENGtotalProjectsValueNumber"
              name="ENGtotalProjectsValueNumber"
              type="number"
              min="0"
              value={formData.ENGtotalProjectsValueNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOTotalProjectsValueNumber">
              KO Total Projects Value Number
            </Label>
            <Input
              id="KOTotalProjectsValueNumber"
              name="KOTotalProjectsValueNumber"
              type="number"
              min="0"
              value={formData.KOTotalProjectsValueNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ENGtotalProjectsValueSuffix">
              ENG Total Projects Value Suffix
            </Label>
            <Input
              id="ENGtotalProjectsValueSuffix"
              name="ENGtotalProjectsValueSuffix"
              value={formData.ENGtotalProjectsValueSuffix}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOTotalProjectsValueSuffix">
              KO Total Projects Value Suffix
            </Label>
            <Input
              id="KOTotalProjectsValueSuffix"
              name="KOTotalProjectsValueSuffix"
              value={formData.KOTotalProjectsValueSuffix}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Total Participants Stats */}
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-semibold">Total Participants Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ENGtotalParticipantsTitle">
              ENG Total Participants Title
            </Label>
            <Input
              id="ENGtotalParticipantsTitle"
              name="ENGtotalParticipantsTitle"
              value={formData.ENGtotalParticipantsTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOTotalParticipantsTitle">
              KO Total Participants Title
            </Label>
            <Input
              id="KOTotalParticipantsTitle"
              name="KOTotalParticipantsTitle"
              value={formData.KOTotalParticipantsTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ENGtotalParticipantsNumber">
              ENG Total Participants Number
            </Label>
            <Input
              id="ENGtotalParticipantsNumber"
              name="ENGtotalParticipantsNumber"
              type="number"
              min="0"
              value={formData.ENGtotalParticipantsNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOTotalParticipantsNumber">
              KO Total Participants Number
            </Label>
            <Input
              id="KOTotalParticipantsNumber"
              name="KOTotalParticipantsNumber"
              type="number"
              min="0"
              value={formData.KOTotalParticipantsNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ENGtotalParticipantsSuffix">
              ENG Total Participants Suffix
            </Label>
            <Input
              id="ENGtotalParticipantsSuffix"
              name="ENGtotalParticipantsSuffix"
              value={formData.ENGtotalParticipantsSuffix}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOTotalParticipantsSuffix">
              KO Total Participants Suffix
            </Label>
            <Input
              id="KOTotalParticipantsSuffix"
              name="KOTotalParticipantsSuffix"
              value={formData.KOTotalParticipantsSuffix}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? isNew
            ? "Creating..."
            : "Updating..."
          : isNew
          ? "Create MICE"
          : "Update MICE"}
      </Button>
    </form>
  );
}
