import Animated,
{
  Easing,
  runOnJS,
  withSpring,
  withTiming,
  useSharedValue,
  WithTimingConfig,
} from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRef, useState } from 'react'
import { StyleSheet, TextInput, View, Dimensions, Keyboard } from 'react-native'

import { SafeView } from '../../components/SafeView'

interface InputRefType extends TextInput {}


const widthScreen = Dimensions.get('screen').width
/**
 * @easing
 * Função de interpolação `easing` controla como a animação progride ao longo do tempo.
 * Permite criar curvas de easing personalizadas usando o método de Bezier;
 */
const userConfig: WithTimingConfig = {
  duration: 900,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
}

export default function AnimatedInputSearch() {
  const inputRef = useRef<InputRefType | null>(null)
  const [inputIsOpen, setInputIsOpen] = useState(false)

  /**
   * @useSharedValue
   * Cria um estado compartilhado entre o lado “JavaScript” e o lado “nativo”.
   * Valores armazenados em `useSharedValue` são acessados e modificados por sua propriedade `.value`.
   */
  const inputWidth = useSharedValue(0)
  const inputLeftPadding = useSharedValue(0)
  const iconCloseOpacity = useSharedValue(0)
  const iconSearchOpacity = useSharedValue(1)

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons)
  const AnimatedInput = Animated.createAnimatedComponent(TextInput)

  /**
   * @param searchOpacity valor inicial da opacidade do ícone de search
   * @param closeOpacity valor inicial da opacidade do ícone de close
   * @function `withTiming` uma das três funções de animação integrada. Recebe três parâmetros `toValue`, `WithTimingConfig` e `callback`.
   * @param toValue valor que você deseja animar de um estado inicial para um estado final (criado com `useSharedValue`). Como a posição de um elemento na tela, a opacidade de um elemento, etc.
   * @param WithTimingConfig objeto de configuração que tem duas propriedades:
   * @prop `duration` quanto tempo a animação vai levar pra atingir o `toValue`
   * @prop `easing` permite ajustar a animação durante o tempo especificado. Por exemplo, você pode fazer a animação começar lentamente, depois aumentar a velocidade e desacelerá-la novamente no final.
   * @function `callback` função executada ao fim da animação (conclusão ou interrupção). Normalmente usada para atualizar o estado do componente React (nesse caso), disparar outra animação ou realizar alguma ação personalizada.
   */
  const onAnimatedIcon = (searchOpacity: number, closeOpacity: number) => {
    iconCloseOpacity.value = withTiming(closeOpacity, userConfig)
    iconSearchOpacity.value = withTiming(searchOpacity, userConfig)
  }

  /**
   * @function setFocus dá foco nu input
   *
   */
  const setFocus = () => {
    if (inputRef.current !== null) {
      inputRef.current.focus()
    }
  }

  /**
   * @function `handleOpenInput` controle a animação de abertura do input
   */
  const handleOpenInput = () => {
    setInputIsOpen(true)

    inputLeftPadding.value = 16
    onAnimatedIcon(0, 1) // Faz a opacidade do ícone de pesquisa ir para 0 e do close para 1


    /**
     * @function `withSpring` tem a mesma assinatura da função `withTiming`.
     * diferem na forma como controlam o comportamento da animação:
     * cria animações com um comportamento elástico, imitando o movimento de uma mola.
     */
    inputWidth.value = withSpring(widthScreen - 32 - 48 /** largura da tela - padding - tamanho total do ícone */,
      {},
      /**
       *
       * @function runOnJs runOnJS é usado quando você deseja atualizar o estado React em resposta a eventos de animação, como a conclusão de uma animação, ou de forma condicional dentro de um gesto.
       */
      () => runOnJS(setFocus)()
    )
  }

  /**
   * @function `handleCloseInput` controle a animação de fechamento do input
   */
  const handleCloseInput = () => {
    Keyboard.dismiss()
    if (inputRef.current !== null) {
      inputRef.current.clear()
    }

    setInputIsOpen(false)

    inputLeftPadding.value = 0
    onAnimatedIcon(1, 0)

    inputWidth.value = withSpring(0,
      {
        mass: 1,
        damping: 100,
        stiffness: 100,
      },
    )
  }

  return (
    <SafeView>
      <View style={styles.wrapperInput}>
        <AnimatedInput
          ref={inputRef}
          style={[styles.input, { width: inputWidth, paddingLeft: inputLeftPadding }]}
          placeholder='Pesquisar...'
          placeholderTextColor={'#555'}
        />

        {!inputIsOpen &&
          <AnimatedIcon
            name="search"
            size={32}
            color="#ffc719"
            style={[styles.icon, { opacity: iconSearchOpacity }]}
            onPress={handleOpenInput}
          />
        }
        {inputIsOpen &&
          <AnimatedIcon
            name="close"
            size={32}
            color="#ffc719"
            style={[styles.icon, { opacity: iconCloseOpacity }]}
            onPress={handleCloseInput}
          />
        }
      </View>
    </SafeView>
  )
}

const styles = StyleSheet.create({
  wrapperInput: {
    width: '100%',
    alignItems: 'center',
    flexDirection:'row',
    justifyContent: 'flex-end'
  },
  input: {
    color: '#222222',
    height: 48,
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: '#ffc719'
  },
  icon: {
    paddingLeft: 16,
    paddingVertical: 16,
  }
})
