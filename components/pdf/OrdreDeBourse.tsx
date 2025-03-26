import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils";
import { Order } from "@/lib/interfaces";

interface OrdreDeBourseProps {
  order: Order | null;
  userData: any;
}

const OrdreDeBourse = ({ order, userData }: OrdreDeBourseProps) => {
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
            textAlign: "center",
            fontSize: 11,
            width: "60%",
            alignSelf: "center",
            fontFamily: "Helvetica-Bold",
            marginVertical: 20,
          }}
        >
          REGISTRE D’ORDRE DE BOURSE
        </Text>
        {/* Form */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12",
            fontSize: "10",
            width: "70%",
            alignSelf: "center",
            marginVertical: "50",
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
            <Text>N° de compte titres :</Text>
            <Text>{userData?.nCompteTitres}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
            <Text>Nom et prénom du donneur d’ordre:</Text>
            <Text>{order?.investorid?.fullname}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
              <Text>Adresse :</Text>
              <Text>{userData?.adresse || "N/A"}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
              <Text>N°CNI/PC :</Text>
              <Text>
                {order?.investorid?.followsbusiness
                  ? userData?.idM
                  : userData?.id}
              </Text>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
            <Text>Agissant pour compte :</Text>
            <Text>
              {order?.investorid?.followsbusiness
                ? userData?.idRL
                : order?.investorid?.fullname}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
            <Text>N° de compte espèces :</Text>
            <Text>{userData?.rib}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10",
              alignItems: "center",
            }}
          >
            <Text>Sens de l’opération de Bourse :</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "4",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 20,
                  border: 1,
                  backgroundColor:
                    order?.orderdirection === 1 ? "black" : "transparent",
                }}
              ></View>
              <Text>Achat</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "4",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 20,
                  border: 1,
                  backgroundColor:
                    order?.orderdirection === 0 ? "black" : "transparent",
                }}
              ></View>
              <Text>Vente</Text>
            </View>
          </View>
        </View>
        {/* Order Table */}
        <View
          style={{
            width: "80%",
            alignSelf: "center",
            fontSize: "8",
            flex: 1,
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
                border: 1,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Valeur
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
              Montant de la transaction
            </Text>
          </View>
          <View>
            {/* Table Rows */}

            <View
              key={order?.id}
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
                  borderLeft: 1,
                  borderBottom: 1,
                }}
                break
              >
                {formatPrice(order?.securityid.facevalue!)}
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
                {formatNumber(order?.quantity || 0)}
              </Text>
              <View
                style={{
                  width: "25%",
                  textAlign: "center",
                  paddingHorizontal: 4,
                  paddingVertical: 12,
                  borderRight: 1,
                  borderBottom: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2",
                }}
                break
              >
                <Text>{order?.ordertypes[1]}</Text>
              </View>
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
                {formatPrice(
                  order?.securityid.facevalue! * (order?.quantity || 1)
                )}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6",
            fontSize: "10",
            width: "70%",
            alignSelf: "center",
            marginBottom: 30,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
            <Text>Validité de l'ordre :</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
            <Text>- Du:</Text>
            <Text>{formatDate(new Date())}</Text>
            <Text>Au :</Text>
            <Text>
              {order?.validity
                ? formatDate(order?.validity)
                : ".................."}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: "4" }}>
            <Text>- {order?.ordertypes[0]}</Text>
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
            marginBottom: 120,
          }}
        >
          <Text>Signature du client </Text>{" "}
          {/*<Text>Signature et cachet de l’IOB</Text> */}
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
              SARL FinnBourse
            </Text>
            <Text style={{ fontSize: 8, marginLeft: 2 }}>
              au capital social de 10.000.000 DZD
            </Text>
          </View>
          <Text style={{ fontSize: 8 }}>
            02, boulevard Mohamed V – Alger Centre
          </Text>
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

export default OrdreDeBourse;
