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
import { useState } from 'react'
import { StyleSheet, View, Pressable, Text, ActivityIndicator } from 'react-native'

import { SafeView } from '../../components/SafeView'
import { asyncSimulation } from '../../utils/asyncSimulation'

interface FormState {
  isLoading: boolean;
}

const initialFormState: FormState = {
  isLoading: false,
}

const userConfig: WithTimingConfig = {
  duration: 200,
  easing: Easing.inOut(Easing.circle),
}

export default function ButtonSend() {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [isButtonClose, setIsButtonClose] = useState(false)

  const buttonWidth = useSharedValue(240)
  const buttonRadius = useSharedValue(8)
  const iconCheckmarkOpacity = useSharedValue(0)

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons)
  const AnimatedButton = Animated.createAnimatedComponent(Pressable)

  const onResetAnimation = () => {
    setIsButtonClose(false)

    buttonWidth.value = 240
    buttonRadius.value = 8
    iconCheckmarkOpacity.value = 0
  }

  const onResetForm = () => {
    setFormState(initialFormState)
  }

  const runButtonAnimation = () => {
    setIsButtonClose(true)

    iconCheckmarkOpacity.value = withTiming(1, userConfig)

    buttonWidth.value = withSpring(40 + 4 + 4 /** tamanho do ícone + padding left + padding right */,
      {},
      () => runOnJS(onResetAnimation)()
    )
    buttonRadius.value = withSpring(9999)
  }

  const handleSendForm = async () => {
    setFormState({
      ...formState,
      isLoading: true,
    })

    await asyncSimulation(1000)

    onResetForm()

    runButtonAnimation()
  }

  return (
    <SafeView>
      <View style={styles.wrapperInput}>
        <AnimatedButton
          style={[styles.button, { width: buttonWidth, borderRadius: buttonRadius }]}
          android_ripple={{ color: '#222222' }}
          onPress={handleSendForm}
        >
          {formState.isLoading ?
            <ActivityIndicator color='#222222' size='large' /> :
            <>
              {isButtonClose ?
                <AnimatedIcon
                  name="md-checkmark-circle-outline"
                  size={40}
                  color="#222222"
                  style={{ opacity: iconCheckmarkOpacity }}
                /> :
                <Text style={styles.text}>Enviar</Text>
              }
            </>
          }
        </AnimatedButton>
      </View>
    </SafeView>
  )
}

const styles = StyleSheet.create({
  wrapperInput: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffc719'
  },
  text: {
    color: '#222222',
    fontSize: 20,
    fontWeight: '600',
  },
})
