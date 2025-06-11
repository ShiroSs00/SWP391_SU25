import React from "react";
import RequestBloodForm from "./RequestBloodForm";
import DonorRegisterForm from "./DonorRegisterForm";

interface BloodOrder {
  id: number;
  user: string;
  type: string;
  date: string;
  status: string;
  note?: string;
  bloodType?: string;
  component?: string;
  eventId?: number;
  volume?: number;
  hospital?: string;
  quantity?: number;
  urgency?: boolean;
  urgencyReason?: string;
}

interface Props {
  order: BloodOrder;
  onChange: (order: BloodOrder) => void;
}

const BloodOrderEditForm: React.FC<Props> = ({ order, onChange }) => {
  if (order.type === "Hiến máu") {
    return (
      <DonorRegisterForm
        initialData={{
          fullName: order.user,
          dob: order.date,
          bloodType: order.bloodType,
          component: order.component,
          eventId: order.eventId?.toString(),
          status: order.status
        }}
        onSubmit={(data) => {
          onChange({
            ...order,
            user: data.fullName,
            date: data.dob,
            bloodType: data.bloodType,
            component: data.component,
            eventId: Number(data.eventId),
            status: data.status
          });
        }}
        isEdit
      />
    );
  }
  return (
    <RequestBloodForm
      initialData={{
        hospitalID: order.hospital || '',
        requestDate: order.date,
        bloodType: order.bloodType,
        component: order.component,
        urgency: order.urgency,
        urgencyReason: order.urgencyReason,
        status: order.status,
        volume: order.volume?.toString(),
        quantity: order.quantity?.toString()
      }}
      onSubmit={(data) => {
        onChange({
          ...order,
          hospital: data.hospitalID,
          date: data.requestDate,
          bloodType: data.bloodType,
          component: data.component,
          urgency: data.urgency,
          urgencyReason: data.urgencyReason,
          status: data.status,
          volume: Number(data.volume),
          quantity: Number(data.quantity)
        });
      }}
      isEdit
    />
  );
};

export default BloodOrderEditForm;