type Rule = {
    keywords: readonly string[];
    response: string;
  };
  
export const BOT_RULES: Record<string, Rule> = {
    studyType: {
      keywords: ["estudio", "radiografía", "tomografía", "resonancia"],
      response: "Puedes filtrar por tipo de estudio usando el selector en la barra de búsqueda.",
    },
    patientSearch: {
      keywords: ["paciente", "buscar"],
      response: "Para buscar un paciente, escribe su nombre o ID en el campo de búsqueda principal.",
    },
    advancedFilters: {
      keywords: ["filtro", "avanzado"],
      response:
        'Haz clic en "Mostrar filtros avanzados" para acceder a más opciones de filtrado como fecha y médico.',
    },
    dateFilter: {
      keywords: ["fecha"],
      response:
        'Puedes filtrar por fecha usando los filtros avanzados. Haz clic en "Mostrar filtros avanzados".',
    },
    statusFilter: {
      keywords: ["pendiente", "nuevo", "revisado", "estado"],
      response:
        "Puedes filtrar por estado del estudio seleccionando la opción correspondiente en el menú desplegable.",
    },
    greeting: {
      keywords: ["hola", "saludos"],
      response: "¡Hola! Soy el asistente virtual del sistema. ¿En qué puedo ayudarte hoy?",
    },
    help: {
      keywords: ["ayuda", "ayúdame"],
      response:
        "Puedo ayudarte con:\n- Búsqueda de pacientes\n- Filtrado de estudios\n- Navegación del sistema\n- Información sobre estados de los estudios",
    },
  } as const;
  
export const DEFAULT_BOT_RESPONSE = "No estoy seguro de cómo ayudarte con eso. ¿Podrías reformular tu pregunta? Puedo ayudarte con búsquedas, filtros o información sobre el sistema.";
  
export function getBotResponse(input: string): string {
    const text = input.toLowerCase();
  
    for (const rule of Object.values(BOT_RULES)) {
      if (rule.keywords.some((k) => text.includes(k))) {
        return rule.response;
      }
    }
  
    return DEFAULT_BOT_RESPONSE;
  }