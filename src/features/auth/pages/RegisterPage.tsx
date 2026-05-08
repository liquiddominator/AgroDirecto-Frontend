import { useState, type FormEvent } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { ProducerLocationMap } from '../../producer/components/ProducerLocationMap';
import type { RegisterRequest, RegisterRole } from '../types/authTypes';
import AuthLayout from '../../../components/layout/AuthLayout';
import { InputField } from '../../../components/ui/InputField';
import { resolveErrorMessage } from '../../../utils/errorUtils';
import { ROLES } from '../../../config/roles';

type RegisterFormState = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: RegisterRole;
  acceptedTerms: boolean;
  acceptedPrivacyPolicy: boolean;
  producerType: 'INDIVIDUAL' | 'ASSOCIATION' | 'COOPERATIVE';
  farmName: string;
  municipality: string;
  province: string;
  department: string;
  experienceYears: string;
  geoLatitude: string;
  geoLongitude: string;
  buyerType: 'INDIVIDUAL' | 'BUSINESS' | 'COMPANY';
  businessName: string;
  cityOrPurchaseZone: string;
  transportType: 'TRUCK' | 'PICKUP' | 'MOTORBIKE' | 'OTHER';
  loadCapacityKg: string;
  operationZone: 'LOCAL' | 'REGIONAL' | 'DEPARTMENTAL';
  driverLicenseNumber: string;
  vehiclePlate: string;
};

const initialForm: RegisterFormState = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  role: ROLES.PRODUCER as RegisterRole,
  acceptedTerms: false,
  acceptedPrivacyPolicy: false,
  producerType: 'INDIVIDUAL',
  farmName: '',
  municipality: '',
  province: '',
  department: 'Santa Cruz',
  experienceYears: '0',
  geoLatitude: '',
  geoLongitude: '',
  buyerType: 'INDIVIDUAL',
  businessName: '',
  cityOrPurchaseZone: '',
  transportType: 'TRUCK',
  loadCapacityKg: '',
  operationZone: 'LOCAL',
  driverLicenseNumber: '',
  vehiclePlate: '',
};

export function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (step === 1) {
      // Aquí deberías añadir la validación del primer paso antes de continuar.
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(toRegisterRequest(form));
      navigate(routes.dashboard);
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout tagline="Crea tu cuenta">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-green-950" id="register-title">
          Crear cuenta
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Completa los siguientes pasos para unirte a AgroDirecto.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 flex justify-center space-x-4" aria-label="Progreso de registro">
        <span className={`text-sm font-medium ${step === 1 ? 'text-green-700 font-bold' : 'text-slate-500'}`}>
          Cuenta
        </span>
        <span className={`text-sm font-medium ${step === 2 ? 'text-green-700 font-bold' : 'text-slate-500'}`}>
          Perfil
        </span>
      </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {step === 1 && <AccountStep form={form} update={update} />}

          {step === 2 && (
            <>
              {form.role === ROLES.PRODUCER && <ProducerFields form={form} update={update} />}
              {form.role === ROLES.BUYER && <BuyerFields form={form} update={update} />}
              {form.role === ROLES.CARRIER && <CarrierFields form={form} update={update} />}
            </>
          )}

          <div className="form-actions">
            {step === 2 && (
              <button
                type="button"
className="flex w-full items-center my-2 justify-center rounded-lg bg-green-800 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"                disabled={isSubmitting}
                onClick={() => {
                  setError('');
                  setStep(1);
                }}
              >
                Atras
              </button>
            )}
            <button type="submit"           className="flex w-full items-center justify-center rounded-lg bg-green-800 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
 disabled={isSubmitting}>
              {step === 1 ? 'Continuar' : isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
            </button>
          </div>
        </form>
      
        <p className="mt-6 text-center text-sm text-slate-600">
          Ya tienes cuenta?{" "}
          <button type="button" className="font-extrabold text-green-700 hover:text-green-950" onClick={() => navigate(routes.login)}>
            Inicia sesión aquí
          </button>
        </p>
    </AuthLayout>
  );

  function update<Key extends keyof RegisterFormState>(key: Key, value: RegisterFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
}

function AccountStep({
  form,
  update,
}: {
  form: RegisterFormState;
  update: <Key extends keyof RegisterFormState>(key: Key, value: RegisterFormState[Key]) => void;
}) {
  return (
    <>
      <div className="space-y-4">
        <InputField
          field={{
            id: 'fullName',
            label: 'Nombre completo',
            type: 'text',
            required: true,
            maxLength: 150,
            autoComplete: 'name',
          }}
          value={form.fullName}
          onChange={update}
        />

        <InputField
          field={{
            id: 'phone',
            label: 'Teléfono',
            type: 'tel',
            required: true,
            maxLength: 30,
            autoComplete: 'tel',
          }}
          value={form.phone}
          onChange={update}
        />

        <InputField
          field={{
            id: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            maxLength: 150,
            autoComplete: 'email',
          }}
          value={form.email}
          onChange={update}
        />

        <InputField
          field={{
            id: 'password',
            label: 'Contraseña',
            type: 'password',
            required: true,
            minLength: 6,
            maxLength: 72,
            autoComplete: 'new-password',
          }}
          value={form.password}
          onChange={update}
        />

        <InputField
          field={{
            id: 'role',
            label: 'Rol',
            type: 'select',
            options: [ROLES.PRODUCER, ROLES.BUYER, ROLES.CARRIER],
            required: true,
          }}
          value={form.role}
          onChange={(id, value) => update(id, value as RegisterRole)}
        />
      </div>

<div className="mt-4 space-y-3">
  <label className="flex items-start gap-2 text-sm text-slate-700">
    <input
      type="checkbox"
      checked={form.acceptedTerms}
      required
      onChange={(event) => update('acceptedTerms', event.target.checked)}
      className="mt-1"
    />
    <span>Acepto los términos</span>
  </label>

  <label className="flex items-start gap-2 text-sm text-slate-700">
    <input
      type="checkbox"
      checked={form.acceptedPrivacyPolicy}
      required
      onChange={(event) => update('acceptedPrivacyPolicy', event.target.checked)}
      className="mt-1"
    />
    <span>Acepto la política de privacidad</span>
  </label>
</div>
    </>
  );
}

function ProducerFields({
  form,
  update,
}: {
  form: RegisterFormState;
  update: <Key extends keyof RegisterFormState>(key: Key, value: RegisterFormState[Key]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-extrabold uppercase tracking-wide text-slate-700 mb-4">Perfil productor</legend>
      <div className="space-y-4">
        <InputField
          field={{
            id: 'producerType',
            label: 'Tipo productor',
            type: 'select',
            options: ['INDIVIDUAL', 'ASSOCIATION', 'COOPERATIVE'],
            required: true,
          }}
          value={form.producerType}
          onChange={(id, value) => update(id, value as RegisterFormState['producerType'])}
        />

        <InputField
          field={{
            id: 'farmName',
            label: 'Nombre de finca',
            type: 'text',
            required: true,
            maxLength: 150,
          }}
          value={form.farmName}
          onChange={update}
        />

        <InputField
          field={{
            id: 'municipality',
            label: 'Municipio',
            type: 'text',
            required: true,
            maxLength: 100,
          }}
          value={form.municipality}
          onChange={update}
        />

        <InputField
          field={{
            id: 'province',
            label: 'Provincia',
            type: 'text',
            required: true,
            maxLength: 100,
          }}
          value={form.province}
          onChange={update}
        />

        <InputField
          field={{
            id: 'department',
            label: 'Departamento',
            type: 'text',
            required: true,
            maxLength: 100,
          }}
          value={form.department}
          onChange={update}
        />

        <InputField
          field={{ id: 'experienceYears', label: 'Años de experiencia', type: 'number', required: true, min: 0 }}
          value={form.experienceYears}
          onChange={update}
        />

        <InputField
          field={{ id: 'geoLatitude', label: 'Latitud GPS', type: 'number', min: -90, max: 90 }}
          value={form.geoLatitude}
          onChange={update}
        />

        <InputField
          field={{ id: 'geoLongitude', label: 'Longitud GPS', type: 'number', min: -180, max: 180 }}
          value={form.geoLongitude}
          onChange={update}
        />
      </div>

      <ProducerLocationMap
        latitude={form.geoLatitude}
        longitude={form.geoLongitude}
        onChange={(latitude, longitude) => {
          update('geoLatitude', latitude);
          update('geoLongitude', longitude);
        }}
      />
    </fieldset>
  );
}

function BuyerFields({
  form,
  update,
}: {
  form: RegisterFormState;
  update: <Key extends keyof RegisterFormState>(key: Key, value: RegisterFormState[Key]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-extrabold uppercase tracking-wide text-slate-700 mb-4">Perfil comprador</legend>
      <div className="space-y-4">
        <InputField
          field={{
            id: 'buyerType',
            label: 'Tipo comprador',
            type: 'select',
            options: ['INDIVIDUAL', 'BUSINESS', 'COMPANY'],
            required: true,
          }}
          value={form.buyerType}
          onChange={(id, value) => update(id, value as RegisterFormState['buyerType'])}
        />

        <InputField
          field={{
            id: 'businessName',
            label: 'Nombre comercial',
            type: 'text',
            maxLength: 150,
          }}
          value={form.businessName}
          onChange={update}
        />

        <InputField
          field={{
            id: 'cityOrPurchaseZone',
            label: 'Ciudad o zona de compra',
            type: 'text',
            required: true,
            maxLength: 150,
          }}
          value={form.cityOrPurchaseZone}
          onChange={update}
        />
      </div>
    </fieldset>
  );
}

function CarrierFields({
  form,
  update,
}: {
  form: RegisterFormState;
  update: <Key extends keyof RegisterFormState>(key: Key, value: RegisterFormState[Key]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-extrabold uppercase tracking-wide text-slate-700 mb-4">Perfil transportista</legend>
      <div className="space-y-4">
        <InputField
          field={{
            id: 'transportType',
            label: 'Tipo transporte',
            type: 'select',
            options: ['TRUCK', 'PICKUP', 'MOTORBIKE', 'OTHER'],
            required: true,
          }}
          value={form.transportType}
          onChange={(id, value) => update(id, value as RegisterFormState['transportType'])}
        />

        <InputField
          field={{
            id: 'loadCapacityKg',
            label: 'Capacidad kg',
            type: 'number',
            required: true,
            min: 0.01,
          }}
          value={form.loadCapacityKg}
          onChange={update}
        />

        <InputField
          field={{
            id: 'operationZone',
            label: 'Zona de operación',
            type: 'select',
            options: ['LOCAL', 'REGIONAL', 'DEPARTMENTAL'],
            required: true,
          }}
          value={form.operationZone}
          onChange={(id, value) => update(id, value as RegisterFormState['operationZone'])}
        />

        <InputField
          field={{
            id: 'driverLicenseNumber',
            label: 'Número de licencia',
            type: 'text',
            required: true,
            maxLength: 50,
          }}
          value={form.driverLicenseNumber}
          onChange={update}
        />

        <InputField
          field={{
            id: 'vehiclePlate',
            label: 'Placa',
            type: 'text',
            required: true,
            maxLength: 20,
          }}
          value={form.vehiclePlate}
          onChange={update}
        />
      </div>
    </fieldset>
  );
}

function toRegisterRequest(form: RegisterFormState): RegisterRequest {
  const baseRequest = {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    password: form.password,
    phone: form.phone.trim(),
    role: form.role,
    acceptedTerms: form.acceptedTerms,
    acceptedPrivacyPolicy: form.acceptedPrivacyPolicy,
  };

  if (form.role === ROLES.PRODUCER) {
    const hasLatitude = form.geoLatitude.trim() !== '';
    const hasLongitude = form.geoLongitude.trim() !== '';
    if (hasLatitude !== hasLongitude) {
      throw new Error('Latitud y longitud deben completarse juntas.');
    }

    return {
      ...baseRequest,
      producerProfile: {
        producerType: form.producerType,
        farmName: form.farmName.trim(),
        municipality: form.municipality.trim(),
        province: form.province.trim(),
        department: form.department.trim(),
        experienceYears: Number(form.experienceYears),
        geoLatitude: hasLatitude ? Number(form.geoLatitude) : null,
        geoLongitude: hasLongitude ? Number(form.geoLongitude) : null,
      },
    };
  }

  if (form.role === ROLES.BUYER) {
    return {
      ...baseRequest,
      buyerProfile: {
        buyerType: form.buyerType,
        businessName: form.businessName.trim() || null,
        cityOrPurchaseZone: form.cityOrPurchaseZone.trim(),
      },
    };
  }

  return {
    ...baseRequest,
    carrierProfile: {
      transportType: form.transportType,
      loadCapacityKg: Number(form.loadCapacityKg),
      operationZone: form.operationZone,
      driverLicenseNumber: form.driverLicenseNumber.trim(),
      vehiclePlate: form.vehiclePlate.trim(),
    },
  };
}
