"use client";

import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

type ModalContextType = {
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const showAlert = (title: string, message: string) => {
    setIsConfirm(false);
    setModalTitle(title);
    setModalMessage(message);
    setOpen(true);
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setIsConfirm(true);
    setModalTitle(title);
    setModalMessage(message);
    setOnConfirmCallback(() => onConfirm);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOnConfirmCallback(null);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) onConfirmCallback();
    handleClose();
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        PaperProps={{ className: "rounded-2xl shadow-xl p-4 dark:bg-gray-800 dark:text-gray-100" }}
      >
        <DialogTitle className="font-extrabold text-2xl">{modalTitle}</DialogTitle>
        <DialogContent>
          <Typography className="text-gray-700 dark:text-gray-300">{modalMessage}</Typography>
        </DialogContent>
        <DialogActions className="pt-4 pr-4">
          <Button onClick={handleClose} variant="outlined" color="inherit">
            {isConfirm ? "Cancel" : "OK"}
          </Button>
          {isConfirm && (
            <Button onClick={handleConfirm} variant="contained" color="secondary" className="bg-pink-500 hover:bg-pink-600">
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
