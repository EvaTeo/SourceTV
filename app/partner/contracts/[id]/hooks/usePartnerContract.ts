"use client";

import { useCallback, useEffect, useState } from "react";

import type { Contract } from "../../types";

export default function usePartnerContract(contractId: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [changeNotes, setChangeNotes] = useState("");
  const [showChangeBox, setShowChangeBox] = useState(false);

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [agreed, setAgreed] = useState(false);

  const loadContract = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/partner/contracts/${contractId}`, {
        cache: "no-store",
      });

      if (res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not load contract.");
        setContract(null);
        return;
      }

      setContract(data);
      setChangeNotes(data.partnerNotes || "");
      setSignatureName(data.partnerSignatureName || "");
      setSignatureDataUrl(data.partnerSignatureDataUrl || "");
    } catch (error) {
      console.error("LOAD PARTNER CONTRACT ERROR:", error);
      alert("Could not load contract.");
      setContract(null);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  async function signContract() {
    if (!contract) return;

    if (!signatureName.trim()) {
      alert("Please enter your legal name.");
      return;
    }

    if (!signatureDataUrl) {
      alert("Please draw your signature.");
      return;
    }

    if (!agreed) {
      alert("You must agree to the contract terms.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/partner/contracts/${contract.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sign",
          signatureName: signatureName.trim(),
          signatureDataUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not sign contract.");
        return;
      }

      setContract(data);
      setShowSignatureModal(false);
      setAgreed(false);
    } catch (error) {
      console.error("SIGN CONTRACT ERROR:", error);
      alert("Could not sign contract.");
    } finally {
      setSaving(false);
    }
  }

  async function requestChanges() {
    if (!contract) return;

    if (!changeNotes.trim()) {
      alert("Please explain what changes you are requesting.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/partner/contracts/${contract.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "request_changes",
          partnerNotes: changeNotes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not request changes.");
        return;
      }

      setContract(data);
      setShowChangeBox(false);
    } catch (error) {
      console.error("REQUEST CONTRACT CHANGES ERROR:", error);
      alert("Could not request changes.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  return {
    contract,
    loading,
    saving,

    changeNotes,
    setChangeNotes,
    showChangeBox,
    setShowChangeBox,

    showSignatureModal,
    setShowSignatureModal,
    signatureName,
    setSignatureName,
    signatureDataUrl,
    setSignatureDataUrl,
    agreed,
    setAgreed,

    signContract,
    requestChanges,
  };
}