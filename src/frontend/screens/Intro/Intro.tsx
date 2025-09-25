// ModernIntro.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import IntroStyle from './IntroStyle';
import Components from '../../components';
import { Slide } from '../../components/SlideContent';
import Icons from '../../constants/svgPath';
import Colors from '../../constants/color';

const { width } = Dimensions.get('window');

const slides: Slide[] = [
  {
    id: 1,
    title: 'AI-Powered Healthcare',
    subtitle: 'Smart Diagnosis',
    description:
      'Experience the future of healthcare with advanced AI technology. Get instant, accurate health assessments powered by machine learning.',
    icon: <Icons.RobotAI height={20} width={20} />,
    emoji: '⚡',
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    features: [
      {
        icon: <Icons.Bolt height={20} width={20} />,
        text: 'Lightning-Fast Analysis',
        color: '#FFD700',
      },
      {
        icon: <Icons.BullsEye height={20} width={20} />,
        text: 'Precision Diagnostics',
        color: '#FFD700',
      },
      {
        icon: <Icons.Clock height={20} width={20} />,
        text: 'Available 24/7',
        color: '#FFD700',
      },
    ],
  },
  {
    id: 2,
    title: 'Expert Consultations',
    subtitle: 'Professional Care',
    description:
      'Connect with world-class medical professionals and AI specialists. Get personalized treatment plans tailored to your health.',
    icon: <Icons.Doctor height={20} width={20} />,
    emoji: '🏆',
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    features: [
      {
        icon: <Icons.Hospital height={20} width={20} />,
        text: 'Certified Specialists',
        color: '#FFD700',
      },
      {
        icon: <Icons.Chat height={20} width={20} />,
        text: 'Real-time Consultations',
        color: '#FFD700',
      },
      {
        icon: <Icons.ClipboardText height={20} width={20} />,
        text: 'Custom Treatment Plans',
        color: '#FFD700',
      },
    ],
  },
  {
    id: 3,
    title: 'Health Monitoring',
    subtitle: 'Track & Improve',
    description:
      'Transform your health journey with intelligent analytics and personalized insights. Track progress and achieve wellness goals.',
    icon: <Icons.ChartBar height={20} width={20} />,
    emoji: '🚀',
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    features: [
      {
        icon: <Icons.ChartLine height={20} width={20} />,
        text: 'Advanced Analytics',
        color: '#FFD700',
      },
      {
        icon: <Icons.Bell height={20} width={20} />,
        text: 'Smart Notifications',
        color: '#FFD700',
      },
      {
        icon: <Icons.MobileAlt height={20} width={20} />,
        text: 'Seamless Experience',
        color: '#FFD700',
      },
    ],
  },
];

const Intro: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Slide change
  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentSlide) {
      setCurrentSlide(index);
      animateSlideTransition();
    }
  };

  const animateSlideTransition = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToSlide = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  };

  const handleGetStarted = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => console.log('Navigate to main app'));
  };

  // Pagination
  const renderPagination = () => (
    <View style={IntroStyle.paginationContainer}>
      {slides.map((_, index) => (
        <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
          <Animated.View
            style={[
              IntroStyle.paginationInner,
              {
                backgroundColor:
                  index === currentSlide ? '#FFF' : 'rgba(255,255,255,0.4)',
                width: index === currentSlide ? 32 : 12,
                transform: [{ scale: index === currentSlide ? pulseAnim : 1 }],
              },
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  // Navigation buttons
  const renderButtons = () => (
    <View style={IntroStyle.buttonContainer}>
      {currentSlide > 0 && (
        <TouchableOpacity style={IntroStyle.backButton} onPress={prevSlide}>
          <Icons.LeftArrow
            height={20}
            width={20}
            fill={Colors.white}
            stroke={Colors.white}
          />
        </TouchableOpacity>
      )}
      <View style={IntroStyle.spacer} />
      {currentSlide < slides.length - 1 ? (
        <TouchableOpacity style={IntroStyle.nextButton} onPress={nextSlide}>
          <Icons.LeftArrow
            height={20}
            width={20}
            fill={Colors.white}
            stroke={Colors.white}
            transform={[{ rotate: '180deg' }]}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={IntroStyle.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={IntroStyle.getStartedButtonText}>🚀 Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={IntroStyle.container}>
      <LinearGradient
        colors={slides[currentSlide].gradient}
        style={IntroStyle.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Components.ParticleBackground />

        <Animated.View
          style={[
            IntroStyle.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {slides.map(item => (
              <View key={item.id} style={IntroStyle.slide}>
                <Components.AnimatedIcon
                  icon={item.icon}
                  emoji={item.emoji}
                  gradient={item.gradient}
                />
                <Components.SlideContent
                  item={item}
                  slideAnim={slideAnim}
                  fadeAnim={fadeAnim}
                />
              </View>
            ))}
          </ScrollView>

          {renderPagination()}
          {renderButtons()}

          {currentSlide < slides.length - 1 && (
            <TouchableOpacity
              style={IntroStyle.skipButton}
              onPress={handleGetStarted}
            >
              <Text style={IntroStyle.skipButtonText}>Skip Introduction</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Intro;
