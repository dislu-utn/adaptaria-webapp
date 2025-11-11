import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faExclamationCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import PageWrapper from "../../components/PageWrapper";
import { post } from "../../utils/network";
import { SwalUtils } from "../../utils/SwalUtils";
import { RootState } from "../../redux/store";

type SyncStatus = "not_started" | "in_progress" | "synchronized" | "error";

interface StatusConfig {
  text: string;
  color: string;
  bgColor: string;
  icon: IconDefinition;
  description: string;
}

export const DisluIntegrationPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [status, setStatus] = useState<SyncStatus>("not_started");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusConfig = (): StatusConfig => {
    switch (status) {
      case "in_progress":
        return {
          text: "En proceso",
          color: "#eab308",
          bgColor: "#fef9c3",
          icon: faClock,
          description: "La sincronización con Dislu está en proceso"
        };
      case "synchronized":
        return {
          text: "Sincronizado",
          color: "#16a34a",
          bgColor: "#dcfce7",
          icon: faCheckCircle,
          description: "La sincronización con Dislu está activa"
        };
      case "error":
        return {
          text: "Error",
          color: "#dc2626",
          bgColor: "#fee2e2",
          icon: faExclamationCircle,
          description: "Ocurrió un error durante la sincronización"
        };
      default:
        return {
          text: "Migración no realizada",
          color: "#dc2626",
          bgColor: "#fee2e2",
          icon: faExclamationCircle,
          description: "La sincronización con Dislu no se encuentra activa"
        };
    }
  };

  const handleSync = async () => {
    try {
      setIsSubmitting(true);
      
      if (!user.institute?.id) {
        SwalUtils.errorSwal(
          "Error",
          "No se pudo obtener el ID de la institución",
          "Aceptar",
          () => {console.log("")}
        );
        setIsSubmitting(false);
        return;
      }
      
      setStatus("in_progress");
      
      const response = await post('/connector/sync', { id: user.institute.id });
      
      if (response.ok) {
        setStatus("synchronized");
        
        SwalUtils.successSwal(
          "Sincronización completada",
          "La sincronización con Dislu se ha completado correctamente",
          "Aceptar",
          () => {console.log("")},
          () => {console.log("")}
        );
      } else {
        setStatus("error");
        SwalUtils.errorSwal(
          "Error",
          "No se pudo completar la sincronización",
          "Aceptar",
          () => {console.log("")}
        );
      }
    } catch (error) {
      console.error("Error en sync:", error);
      setStatus("error");
      SwalUtils.errorSwal(
        "Error",
        "Error al sincronizar con Dislu",
        "Aceptar",
        () => {console.log("")}
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <PageWrapper title="Integración con Dislu">
      <div className="container" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <Card>
          <CardHeader>
            <CardTitle className="d-flex align-items-center gap-2" style={{ fontSize: "1.5rem" }}>
              <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ 
                  height: "32px", 
                  width: "32px", 
                  borderRadius: "8px", 
                  backgroundColor: "rgba(78, 168, 222, 0.2)" 
                }}
              >
                <span style={{ color: "#4ea8de", fontWeight: "bold" }}>D</span>
              </div>
              <strong>Dislu</strong>
            </CardTitle>
            <p className="text-muted" style={{ marginBottom: 0, marginTop: "0.5rem" }}>
              Integración con el sistema de gestión de aprendizaje adaptativo
            </p>
          </CardHeader>
          <CardBody>
            <div 
              className="d-flex align-items-center gap-3 p-3 rounded border"
              style={{
                backgroundColor: statusConfig.bgColor,
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ color: statusConfig.color }}>
                <FontAwesomeIcon icon={statusConfig.icon} size="lg" />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontWeight: 600 }}>Estado:</span>
                  <span style={{ fontWeight: "bold", color: statusConfig.color }}>
                    {statusConfig.text}
                  </span>
                </div>
                <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.875rem" }}>
                  {statusConfig.description}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Button
                color="primary"
                block
                size="lg"
                onClick={handleSync}
                disabled={isSubmitting || status === "in_progress" || status === "synchronized"}
                style={{
                  backgroundColor: "#4ea8de",
                  borderColor: "#4ea8de",
                  padding: "0.75rem",
                  fontSize: "1.125rem"
                }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Iniciando...
                  </>
                ) : status === "synchronized" ? (
                  "Migración Completada"
                ) : status === "in_progress" ? (
                  "Migración en Proceso"
                ) : (
                  "Iniciar Migración"
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageWrapper>
  );
};

