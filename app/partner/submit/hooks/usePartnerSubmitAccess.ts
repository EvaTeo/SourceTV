"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import type { ProjectForm } from "../types";

export default function usePartnerSubmitAccess(
  setForm: Dispatch<
    SetStateAction<ProjectForm>
  >
) {
  const [checkingAccess, setCheckingAccess] =
    useState(true);

  useEffect(() => {
    const userData =
      localStorage.getItem("sourcetvUser");

    if (!userData) {
      window.location.href = "/login";
      return;
    }

    try {
      const currentUser = JSON.parse(userData);

      if (
        currentUser.role !== "partner" &&
        currentUser.role !== "admin"
      ) {
        window.location.href = "/partner/apply";
        return;
      }

      setForm((current) => ({
        ...current,
        creatorName: currentUser.name || "",
      }));

      setCheckingAccess(false);
    } catch (error) {
      console.error(
        "PARTNER ACCESS CHECK ERROR:",
        error
      );

      localStorage.removeItem("sourcetvUser");
      window.location.href = "/login";
    }
  }, [setForm]);

  return checkingAccess;
}