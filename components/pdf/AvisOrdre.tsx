import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { Order } from "@/lib/interfaces";
import { formatDate } from "@/lib/utils";

// Define the GetOrdersResponse interface
interface GetOrdersResponse {
  listOrdersExtended: Order[];
}

// Update the component to accept props
const AvisOrdre: React.FC<{ orders: GetOrdersResponse | null }> = ({
  orders,
}) => {
  return (
    <Document>
      <Page size="A4">
        {/* Header Section */}
        <View
          fixed
          style={{
            width: "70%",
            alignSelf: "center",
            marginVertical: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Image src="public/LOGO.png" style={{ width: "8%" }} />
            <Text
              style={{
                fontSize: "8",
                color: "#15383E",
                fontWeight: "bold",
                fontFamily: "Helvetica-Bold",
              }}
            >
              FINNBOURSE…INVEST IN GROWTH
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "red",
              alignSelf: "center",
            }}
          ></View>
        </View>
        {/* Title Section */}
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            width: "60%",
            alignSelf: "center",
            fontFamily: "Helvetica-Bold",
            marginVertical: 20,
          }}
        >
          FinnBourse au Capital Social de 100.000.000 DA Intermédiaire en
          opération de bourse
        </Text>
        <Text
          style={{
            fontSize: 8,
            width: "70%",
            alignSelf: "center",
            marginVertical: 10,
          }}
        >
          Date de la séance : …………………………………
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 11,
            width: "60%",
            alignSelf: "center",
            fontFamily: "Helvetica-Bold",
            marginVertical: 20,
          }}
        >
          Registre des Ordres
        </Text>
        {/* Orders Table */}
        <View
          style={{
            width: "80%",
            alignSelf: "center",
            fontSize: "8",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Header Row */}
          <View
            fixed
            style={{
              flexDirection: "row",
              backgroundColor: "#f0f0f0",
            }}
          >
            <Text
              style={{
                width: "25%",
                textAlign: "center",
                paddingHorizontal: 4,
                paddingVertical: 12,
                border: "solid",

                fontFamily: "Helvetica-Bold",
              }}
            >
              Identifiant
            </Text>
            <Text
              style={{
                width: "25%",
                textAlign: "center",
                paddingHorizontal: 4,
                paddingVertical: 12,
                borderRight: 1,
                borderBottom: 1,
                borderTop: 1,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Titre
            </Text>
            <Text
              style={{
                width: "25%",
                textAlign: "center",
                paddingHorizontal: 4,
                paddingVertical: 12,
                borderRight: 1,
                borderBottom: 1,
                borderTop: 1,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Sens
            </Text>
            <Text
              style={{
                width: "25%",
                textAlign: "center",
                paddingHorizontal: 4,
                paddingVertical: 12,
                borderRight: 1,
                borderBottom: 1,
                borderTop: 1,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Quantité
            </Text>
            <Text
              style={{
                width: "25%",
                textAlign: "center",
                paddingHorizontal: 4,
                paddingVertical: 12,
                borderRight: 1,
                borderBottom: 1,
                borderTop: 1,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Cours Limité
            </Text>
            <Text
              style={{
                width: "25%",
                textAlign: "center",
                paddingHorizontal: 4,
                paddingVertical: 12,
                borderRight: 1,
                borderBottom: 1,
                borderTop: 1,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Validité de l'ordre
            </Text>
            <Text
              style={{
                width: "25%",
                textAlign: "center",
                paddingHorizontal: 4,
                paddingVertical: 12,
                borderRight: 1,
                borderBottom: 1,
                borderTop: 1,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Nature CL/NC
            </Text>
          </View>
          <View>
            {/* Table Rows */}
            {orders?.listOrdersExtended
              .filter((order) =>
                order?.ordertypes?.some((type) =>
                  [
                    "action",
                    "obligation",
                    "sukukms",
                    "titresparticipatifsmp",
                  ].includes(type)
                )
              )
              .map((order, index) => (
                <View
                  key={order.id}
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "25%",
                      textAlign: "center",
                      paddingHorizontal: 4,
                      paddingVertical: 12,
                      borderRight: 1,
                      borderBottom: 1,
                      borderLeft: 1,
                      flexWrap: "wrap",
                    }}
                    break
                  >
                    {order?.id
                      ? order.id.split("-").slice(0, 2).join("-")
                      : "N/A"}
                  </Text>
                  <Text
                    style={{
                      width: "25%",
                      textAlign: "center",
                      paddingHorizontal: 4,
                      paddingVertical: 12,
                      borderRight: 1,
                      borderBottom: 1,
                    }}
                    break
                  >
                    {order?.securityid?.name}
                  </Text>
                  <Text
                    style={{
                      width: "25%",
                      textAlign: "center",
                      paddingHorizontal: 4,
                      paddingVertical: 12,
                      borderRight: 1,
                      borderBottom: 1,
                    }}
                    break
                  >
                    {order?.orderdirection === 1 ? "Achat" : "Vente"}
                  </Text>
                  <Text
                    style={{
                      width: "25%",
                      textAlign: "center",
                      paddingHorizontal: 4,
                      paddingVertical: 12,
                      borderRight: 1,
                      borderBottom: 1,
                    }}
                    break
                  >
                    {order?.quantity}
                  </Text>
                  <Text
                    style={{
                      width: "25%",
                      textAlign: "center",
                      paddingHorizontal: 4,
                      paddingVertical: 12,
                      borderRight: 1,
                      borderBottom: 1,
                    }}
                    break
                  >
                    {order?.ordertypes?.includes("COMMANDE_A_COURS_LIMITE")
                      ? "cours limité"
                      : order?.ordertypes?.includes("COMMANDE_AU_MIEUX")
                      ? "au mieux"
                      : order?.ordertypes?.includes("COMMANDE_DE_JOUR")
                      ? "de jour"
                      : order?.ordertypes?.includes("COMMANDE_A_REVOCATION")
                      ? "à révocation"
                      : order?.ordertypes?.includes("COMMANDE_A_DUREE_LIMITEE")
                      ? "à durée limitée"
                      : order?.ordertypes?.includes("COMMANDE_A_EXECUTION")
                      ? "à exécution"
                      : order?.ordertypes?.includes("COMMANDE_TOUT_OU_RIEN")
                      ? "tout ou rien"
                      : order?.ordertypes?.includes("COMMANDE_SANS_STIPULATION")
                      ? "sans stipulation"
                      : "inconnu"}
                  </Text>
                  <Text
                    style={{
                      width: "25%",
                      textAlign: "center",
                      paddingHorizontal: 4,
                      paddingVertical: 12,
                      borderRight: 1,
                      borderBottom: 1,
                    }}
                    break
                  >
                    {formatDate(order?.orderdate)}
                  </Text>
                  <Text
                    style={{
                      width: "25%",
                      textAlign: "center",
                      paddingHorizontal: 4,
                      paddingVertical: 12,
                      borderRight: 1,
                      borderBottom: 1,
                    }}
                    break
                  >
                    {order?.negotiatorid?.followsbusiness
                      ? "Entreprise"
                      : "Particulier"}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* Cachet / Signature */}
        <View
          style={{
            width: "65%",
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontSize: 8,
            marginTop: 20,
            marginBottom: 60,
          }}
        >
          <Text>Signature du mandataire</Text> <Text>Cachet de la SGBV </Text>
        </View>
        {/* Footer Section */}
        <View
          fixed
          style={{
            width: "70%",
            alignSelf: "center",
            marginVertical: 20,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <View
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "red",
              alignSelf: "center",
            }}
          ></View>
          <View
            style={{ paddingTop: 8, display: "flex", flexDirection: "row" }}
          >
            <Text
              style={{
                color: "red",
                fontSize: 8,
                fontFamily: "Helvetica-Bold",
              }}
            >
              FinnBourse
            </Text>
            <Text style={{ fontSize: 8, marginLeft: 2 }}>
              au capital social de 100.000.000 DZD
            </Text>
          </View>
          <Text style={{ fontSize: 8 }}>lot n° 08 2eme étage, Hydra 16035</Text>
          <Text
            style={{
              textDecoration: "underline",
              color: "blue",
              fontSize: 8,
            }}
          >
            info@finnetude.com
          </Text>
          <Text style={{ fontSize: 8 }}>Tél. : 021 78 23 77</Text>
        </View>
      </Page>
    </Document>
  );
};

export default AvisOrdre;
