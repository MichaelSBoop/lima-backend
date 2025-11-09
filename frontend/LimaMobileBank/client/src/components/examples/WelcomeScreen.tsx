import WelcomeScreen from '../WelcomeScreen'

export default function WelcomeScreenExample() {
  return <WelcomeScreen onNext={() => console.log('Next clicked')} />
}
