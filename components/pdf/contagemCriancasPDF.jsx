import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#11253d",
  },
  header: {
    marginBottom: 22,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  title: {
    marginBottom: 6,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  subtitle: {
    fontSize: 12,
    color: "#5f6f7f",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f4f8ff",
  },
  summaryText: {
    fontSize: 10,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#dce7f2",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dce7f2",
  },
  headerRow: {
    backgroundColor: "#f4f8ff",
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 10,
  },
  headerCell: {
    fontWeight: "bold",
    color: "#1d4ed8",
  },
  room: {
    width: "34%",
  },
  count: {
    width: "33%",
  },
  footer: {
    position: "absolute",
    right: 36,
    bottom: 24,
    left: 36,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dce7f2",
    textAlign: "center",
    fontSize: 9,
    color: "#5f6f7f",
  },
});

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function totalizar(valores) {
  return valores.reduce((total, quantidade) => total + (quantidade ?? 0), 0);
}

function contarSalasPreenchidas(valores) {
  return valores.filter((quantidade) => quantidade !== null && quantidade !== undefined).length;
}

export default function ContagemCriancasPDF({ registros }) {
  return (
    <Document>
      {registros.map((registro) => {
        const totalManha = totalizar(registro.manha);
        const totalTarde = totalizar(registro.tarde);

        return (
          <Page key={registro.data} size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>Quantidade de crianças</Text>
              <Text style={styles.subtitle}>Registro do dia {formatarData(registro.data)}</Text>
            </View>

            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                Manhã: {totalManha} crianças ({contarSalasPreenchidas(registro.manha)}/13 salas)
              </Text>
              <Text style={styles.summaryText}>
                Tarde: {totalTarde} crianças ({contarSalasPreenchidas(registro.tarde)}/13 salas)
              </Text>
            </View>

            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.headerCell, styles.room]}>Sala</Text>
                <Text style={[styles.cell, styles.headerCell, styles.count]}>Manhã</Text>
                <Text style={[styles.cell, styles.headerCell, styles.count]}>Tarde</Text>
              </View>
              {Array.from({ length: 13 }, (_, indice) => (
                <View
                  key={indice}
                  style={[
                    styles.row,
                    indice === 12 ? { borderBottomWidth: 0 } : {},
                  ]}
                >
                  <Text style={[styles.cell, styles.room]}>Sala {indice + 1}</Text>
                  <Text style={[styles.cell, styles.count]}>
                    {registro.manha[indice] ?? "—"}
                  </Text>
                  <Text style={[styles.cell, styles.count]}>
                    {registro.tarde[indice] ?? "—"}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.footer}>
              Documento gerado em {new Date().toLocaleDateString("pt-BR")}
            </Text>
          </Page>
        );
      })}
    </Document>
  );
}
