import { Link } from 'expo-router'
import { Href } from 'expo-router/build/link/href'
import {Text, Pressable, StyleSheet} from 'react-native'

interface ButtonProps {
  href: Href;
  title: string;
}

export function Button({ href, title }: ButtonProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={styles.button}
        android_ripple={{color: '#010001'}}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    minWidth: 280,
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#ffc719',
    paddingHorizontal: 16,
  },
  text: {
    color: '#222222',
    fontSize: 24,
    fontWeight: '600',
  },
})
