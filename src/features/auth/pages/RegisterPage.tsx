import { useState, type FormEvent } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { isApiError } from '../../../lib/api/apiError';
import { ProducerLocationMap } from '../../producer/components/ProducerLocationMap';
import type { RegisterRequest, RegisterRole } from '../types/authTypes';

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
  role: 'PRODUCER',
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
      const stepError = validateAccountStep(form);
      if (stepError) {
        setError(stepError);
        return;
      }
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
    <main className="auth-page">
      <section className="auth-panel register-panel" aria-labelledby="register-title">
        <div className="auth-heading">
          <p>AgroDirecto</p>
          <h1 id="register-title">Crear cuenta</h1>
        </div>

        <div className="stepper" aria-label="Progreso de registro">
          <span className={step === 1 ? 'active' : ''}>Cuenta</span>
          <span className={step === 2 ? 'active' : ''}>Perfil</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {step === 1 && <AccountStep form={form} update={update} />}

          {step === 2 && (
            <>
              {form.role === 'PRODUCER' && <ProducerFields form={form} update={update} />}
              {form.role === 'BUYER' && <BuyerFields form={form} update={update} />}
              {form.role === 'CARRIER' && <CarrierFields form={form} update={update} />}
            </>
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            {step === 2 && (
              <button
                type="button"
                className="ghost-button"
                disabled={isSubmitting}
                onClick={() => {
                  setError('');
                  setStep(1);
                }}
              >
                Atras
              </button>
            )}
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {step === 1 ? 'Continuar' : isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
            </button>
          </div>
        </form>

        <button type="button" className="link-button" onClick={() => navigate(routes.login)}>
          Ya tengo cuenta
        </button>
      </section>
    </main>
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
      <div className="form-grid">
        <label>
          Nombre completo
          <input
            value={form.fullName}
            required
            maxLength={150}
            autoComplete="name"
            onChange={(event) => update('fullName', event.target.value)}
          />
        </label>

        <label>
          Telefono
          <input
            value={form.phone}
            required
            maxLength={30}
            autoComplete="tel"
            onChange={(event) => update('phone', event.target.value)}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            required
            maxLength={150}
            autoComplete="email"
            onChange={(event) => update('email', event.target.value)}
          />
        </label>

        <label>
          Contrasenia
          <input
            type="password"
            value={form.password}
            required
            minLength={6}
            maxLength={72}
            autoComplete="new-password"
            onChange={(event) => update('password', event.target.value)}
          />
        </label>
      </div>

      <label>
        Rol
        <select
          value={form.role}
          onChange={(event) => update('role', event.target.value as RegisterRole)}
        >
          <option value="PRODUCER">Productor</option>
          <option value="BUYER">Comprador</option>
          <option value="CARRIER">Transportista</option>
        </select>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.acceptedTerms}
          required
          onChange={(event) => update('acceptedTerms', event.target.checked)}
        />
        Acepto los terminos
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.acceptedPrivacyPolicy}
          required
          onChange={(event) => update('acceptedPrivacyPolicy', event.target.checked)}
        />
        Acepto la politica de privacidad
      </label>
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
      <legend>Perfil productor</legend>
      <div className="form-grid">
        <label>
          Tipo productor
          <select
            value={form.producerType}
            onChange={(event) =>
              update('producerType', event.target.value as RegisterFormState['producerType'])
            }
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="ASSOCIATION">Asociacion</option>
            <option value="COOPERATIVE">Cooperativa</option>
          </select>
        </label>

        <label>
          Nombre de finca
          <input
            value={form.farmName}
            required
            maxLength={150}
            onChange={(event) => update('farmName', event.target.value)}
          />
        </label>

        <label>
          Municipio
          <input
            value={form.municipality}
            required
            maxLength={100}
            onChange={(event) => update('municipality', event.target.value)}
          />
        </label>

        <label>
          Provincia
          <input
            value={form.province}
            required
            maxLength={100}
            onChange={(event) => update('province', event.target.value)}
          />
        </label>

        <label>
          Departamento
          <input
            value={form.department}
            required
            maxLength={100}
            onChange={(event) => update('department', event.target.value)}
          />
        </label>

        <label>
          Anios de experiencia
          <input
            type="number"
            value={form.experienceYears}
            required
            min={0}
            onChange={(event) => update('experienceYears', event.target.value)}
          />
        </label>

        <label>
          Latitud GPS
          <input
            type="number"
            value={form.geoLatitude}
            min={-90}
            max={90}
            step="0.0000001"
            onChange={(event) => update('geoLatitude', event.target.value)}
          />
        </label>

        <label>
          Longitud GPS
          <input
            type="number"
            value={form.geoLongitude}
            min={-180}
            max={180}
            step="0.0000001"
            onChange={(event) => update('geoLongitude', event.target.value)}
          />
        </label>
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
      <legend>Perfil comprador</legend>
      <div className="form-grid">
        <label>
          Tipo comprador
          <select
            value={form.buyerType}
            onChange={(event) =>
              update('buyerType', event.target.value as RegisterFormState['buyerType'])
            }
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="BUSINESS">Negocio</option>
            <option value="COMPANY">Empresa</option>
          </select>
        </label>

        <label>
          Nombre comercial
          <input
            value={form.businessName}
            maxLength={150}
            onChange={(event) => update('businessName', event.target.value)}
          />
        </label>

        <label>
          Ciudad o zona de compra
          <input
            value={form.cityOrPurchaseZone}
            required
            maxLength={150}
            onChange={(event) => update('cityOrPurchaseZone', event.target.value)}
          />
        </label>
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
      <legend>Perfil transportista</legend>
      <div className="form-grid">
        <label>
          Tipo transporte
          <select
            value={form.transportType}
            onChange={(event) =>
              update('transportType', event.target.value as RegisterFormState['transportType'])
            }
          >
            <option value="TRUCK">Camion</option>
            <option value="PICKUP">Camioneta</option>
            <option value="MOTORBIKE">Motocicleta</option>
            <option value="OTHER">Otro</option>
          </select>
        </label>

        <label>
          Capacidad kg
          <input
            type="number"
            value={form.loadCapacityKg}
            required
            min={0.01}
            step="0.01"
            onChange={(event) => update('loadCapacityKg', event.target.value)}
          />
        </label>

        <label>
          Zona de operacion
          <select
            value={form.operationZone}
            onChange={(event) =>
              update('operationZone', event.target.value as RegisterFormState['operationZone'])
            }
          >
            <option value="LOCAL">Local</option>
            <option value="REGIONAL">Regional</option>
            <option value="DEPARTMENTAL">Departamental</option>
          </select>
        </label>

        <label>
          Numero de licencia
          <input
            value={form.driverLicenseNumber}
            required
            maxLength={50}
            onChange={(event) => update('driverLicenseNumber', event.target.value)}
          />
        </label>

        <label>
          Placa
          <input
            value={form.vehiclePlate}
            required
            maxLength={20}
            onChange={(event) => update('vehiclePlate', event.target.value)}
          />
        </label>
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

  if (form.role === 'PRODUCER') {
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

  if (form.role === 'BUYER') {
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

function validateAccountStep(form: RegisterFormState) {
  if (!form.fullName.trim()) {
    return 'El nombre completo es obligatorio.';
  }
  if (!form.phone.trim()) {
    return 'El telefono es obligatorio.';
  }
  if (!form.email.trim()) {
    return 'El email es obligatorio.';
  }
  if (form.password.length < 6) {
    return 'La contrasenia debe tener al menos 6 caracteres.';
  }
  if (!form.acceptedTerms || !form.acceptedPrivacyPolicy) {
    return 'Debe aceptar los terminos y la politica de privacidad.';
  }
  return '';
}

function resolveErrorMessage(error: unknown) {
  if (isApiError(error)) {
    const detailMessages = Object.values(error.details);
    if (detailMessages.length > 0) {
      return detailMessages.join(' ');
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo crear la cuenta. Intente nuevamente.';
}
