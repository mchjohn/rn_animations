import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '../components/Buttons'

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Escolha uma animação na lista</Text>

      <View style={styles.content}>
        <Button href='/inputsearch' title='Input de pesquisa' />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: '#222222'
  },
  content: {
    gap: 10,
    marginTop: 32,
  },
  text: {
    color: '#f4f4f4',
    fontSize: 18,
    fontWeight: '600',
  }
})
