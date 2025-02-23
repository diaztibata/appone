import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";

// 🔹 Configuración manual de Firestore (desde la REST API)
const PROJECT_ID = "prueba1-afad4"; // Reemplaza con tu Project ID
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/usuarios`;

export default function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    const res = await fetch(FIRESTORE_URL);
    const data = await res.json();
    if (data.documents) {
      const lista = data.documents.map((doc) => ({
        id: doc.name.split("/").pop(),
        nombre: doc.fields.nombre.stringValue,
        edad: doc.fields.edad.integerValue,
      }));
      setUsuarios(lista);
    }
  };

  const agregarUsuario = async () => {
    if (nombre && edad) {
      await fetch(FIRESTORE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: { nombre: { stringValue: nombre }, edad: { integerValue: Number(edad) } },
        }),
      });
      setNombre("");
      setEdad("");
      obtenerUsuarios();
    } else {
      Alert.alert("Error", "Completa todos los campos");
    }
  };

  const eliminarUsuario = async (id) => {
    await fetch(`${FIRESTORE_URL}/${id}`, { method: "DELETE" });
    obtenerUsuarios();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Gestión de Usuarios
      </Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, marginBottom: 5, padding: 5 }}
      />

      <TextInput
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Button title="Agregar Usuario" onPress={agregarUsuario} />

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>{item.nombre} - {item.edad} años</Text>
            <Button title="❌" onPress={() => eliminarUsuario(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
