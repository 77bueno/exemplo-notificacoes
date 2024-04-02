import { StyleSheet, Text, View, StatusBar, Button } from 'react-native';

/* Importando TODOS os recursos para notificação  */
import * as Notifications from "expo-notifications";

import { useState, useEffect } from 'react';

/* Manipulador de eventos de notificações */
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

export default function App() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    /* Verificações/configurações de permissões de notificação
    exclusivas para iOS */
    async function permissoesIos() {
      return await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
        }
      })
    }
    permissoesIos();

    /* Ouvindo de evento para notificações recebidas, ou seja, quando a notificação
    aparece no topo do app. */
    Notifications.addNotificationReceivedListener(notificacao => {
      console.log(notificacao);
    });

    /* Ouvinte de evento para as respostas dadas às notificações, 
    ou seja, quando o usuário interage (toca) notifiacção. */
    Notifications.addNotificationResponseReceivedListener((resposta) => {
      setDados(resposta.notification.request.content.data);
    })
  }, [])
  const enviarMensagem = async () => {
    /* Montando a mensagem que será enviada via sistema de notificação LOCAL */
    const mensagem = {
      title: "Lembrete! 😛",
      body: "Não se esqueça de estudar muito... senão, reprova! 😈",
      data: {
        usuario: "Chapolin Colorado",
        cidade: "São Paulo"
      }
    }

    /* Função de agendamento de notificaões */
    await Notifications.scheduleNotificationAsync({
      // Conteudo da notificação
      content: mensagem,

      // acionador/disparador da notificação
      trigger: { seconds: 5 },
    })
  };
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text>Exemplo de Notificações!</Text>
        <Button title='Disparar Notificações' onPress={enviarMensagem} />

        {dados && (
          <View style={{ marginVertical: 8, backgroundColor: "yellow" }}>
            <Text>Usuario: {dados.usuario} </Text>
            <Text>Cidade: {dados.cidade} </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
