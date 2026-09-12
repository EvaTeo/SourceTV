"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  fetchAdminContract,
  saveAdminContract,
} from "../lib/contractApi";

import type {
  AdminContract,
  ContractAction,
} from "../types";

export default function useAdminContract(
  id: string
) {
  const [
    contract,
    setContract,
  ] =
    useState<AdminContract | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const isSigned =
    contract?.status ===
    "signed";

  async function loadContract() {
    try {
      setLoading(true);

      const nextContract =
        await fetchAdminContract(
          id
        );

      setContract(
        nextContract
      );
    } catch (error) {
      console.error(
        "LOAD CONTRACT ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not load contract."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveContract(
    action?: ContractAction
  ) {
    if (!contract) {
      return;
    }

    try {
      setSaving(true);

      const nextContract =
        await saveAdminContract(
          contract,
          action
        );

      setContract(
        nextContract
      );
    } catch (error) {
      console.error(
        "SAVE CONTRACT ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not save contract."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateContract<
    K extends keyof AdminContract,
  >(
    key: K,
    value: AdminContract[K]
  ) {
    setContract(
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          [key]: value,
        };
      }
    );
  }

  useEffect(() => {
    void loadContract();

    // Keep this mount-style load behavior
    // consistent with the existing editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    contract,
    loading,
    saving,
    isSigned,

    updateContract,
    saveContract,
    reloadContract:
      loadContract,
  };
}