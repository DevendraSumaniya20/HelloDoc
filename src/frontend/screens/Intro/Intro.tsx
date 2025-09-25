import React, { useRef, useState } from 'react';
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
import { moderateScale } from '../../constants/responsive';
import { getUserFromStorage } from '../../services/storageService';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';

// Screen width for calculating pagination/slide positions
const { width } = Dimensions.get('window');

// -----------------------------------------------------------------------------
// Slide data - each slide contains:
// - Title, subtitle, description
// - Icon & emoji (React components)
// - Gradient background
// - Features list (with icons & text)
// -----------------------------------------------------------------------------
const slides: Slide[] = [
  {
    id: 1,
    title: 'AI-Powered Healthcare',
    subtitle: 'Smart Diagnosis',
    description:
      'Experience the future of healthcare with advanced AI technology. Get instant, accurate health assessments powered by machine learning.',
    icon: (
      <Icons.RobotAI
        height={moderateScale(60)}
        width={moderateScale(60)}
        fill={Colors.white}
        stroke={Colors.white}
      />
    ),
    emoji: <Icons.Bolt height={moderateScale(20)} width={moderateScale(20)} />,
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    features: [
      {
        icon: <Icons.Bolt height={20} width={20} />,
        text: 'Lightning-Fast Analysis',
        color: Colors.white,
      },
      {
        icon: <Icons.BullsEye height={20} width={20} />,
        text: 'Precision Diagnostics',
        color: Colors.white,
      },
      {
        icon: <Icons.Clock height={20} width={20} />,
        text: 'Available 24/7',
        color: Colors.white,
      },
    ],
  },
  {
    id: 2,
    title: 'Expert Consultations',
    subtitle: 'Professional Care',
    description:
      'Connect with world-class medical professionals and AI specialists. Get personalized treatment plans tailored to your health.',
    icon: <Icons.Doctor height={moderateScale(60)} width={moderateScale(60)} />,
    emoji: (
      <Icons.Trophy height={moderateScale(20)} width={moderateScale(20)} />
    ),
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    features: [
      {
        icon: <Icons.Hospital height={20} width={20} />,
        text: 'Certified Specialists',
        color: Colors.white,
      },
      {
        icon: <Icons.Chat height={20} width={20} />,
        text: 'Real-time Consultations',
        color: Colors.white,
      },
      {
        icon: <Icons.ClipboardText height={20} width={20} />,
        text: 'Custom Treatment Plans',
        color: Colors.white,
      },
    ],
  },
  {
    id: 3,
    title: 'Health Monitoring',
    subtitle: 'Track & Improve',
    description:
      'Transform your health journey with intelligent analytics and personalized insights. Track progress and achieve wellness goals.',
    icon: (
      <Icons.ChartBar height={moderateScale(60)} width={moderateScale(60)} />
    ),
    emoji: (
      <Icons.Rocket height={moderateScale(20)} width={moderateScale(20)} />
    ),
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    features: [
      {
        icon: <Icons.ChartLine height={20} width={20} />,
        text: 'Advanced Analytics',
        color: Colors.white,
      },
      {
        icon: <Icons.Bell height={20} width={20} />,
        text: 'Smart Notifications',
        color: Colors.white,
      },
      {
        icon: <Icons.MobileAlt height={20} width={20} />,
        text: 'Seamless Experience',
        color: Colors.white,
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// Intro Component
// -----------------------------------------------------------------------------
const Intro: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Current slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // ScrollView ref for programmatic navigation
  const scrollRef = useRef<ScrollView>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current; // Fades in/out slide
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scales slide
  const slideAnim = useRef(new Animated.Value(0)).current; // Slide transition
  const pulseAnim = useRef(new Animated.Value(1)).current; // Pagination pulse

  // Handle manual scrolling between slides
  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentSlide) {
      setCurrentSlide(index);
      animateSlideTransition();
    }
  };

  // Animate slide transition (small bump effect)
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

  // Navigate to a specific slide
  const goToSlide = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentSlide(index);
  };

  // Next / Previous slide handlers
  const nextSlide = () =>
    currentSlide < slides.length - 1 && goToSlide(currentSlide + 1);
  const prevSlide = () => currentSlide > 0 && goToSlide(currentSlide - 1);

  // Final "Get Started" handler
  const handleGetStarted = async () => {
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
    ]).start(async () => {
      const user = await getUserFromStorage();
      if (user) {
        navigation.replace('MainStack');
      } else {
        navigation.replace('AuthStack');
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Pagination dots (animated scale + color change)
  // ---------------------------------------------------------------------------

  const renderPaginationWithArrows = () => (
    <View style={IntroStyle.paginationContainer}>
      {/* Left Arrow */}
      {currentSlide > 0 ? (
        <TouchableOpacity
          style={IntroStyle.arrowButton} // new style for white circle background
          onPress={prevSlide}
        >
          <Icons.LeftArrow height={20} width={20} fill={Colors.white} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} /> // placeholder
      )}

      {/* Pagination Dots */}
      <View style={IntroStyle.paginationDots}>
        {slides.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
            <Animated.View
              style={[
                IntroStyle.paginationInner,
                {
                  backgroundColor:
                    index === currentSlide ? Colors.white : Colors.grayMedium,
                  width: index === currentSlide ? 32 : 12,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Right Arrow */}
      {currentSlide < slides.length - 1 ? (
        <TouchableOpacity
          style={IntroStyle.arrowButton} // new style for white circle background
          onPress={nextSlide}
        >
          <Icons.LeftArrow
            height={20}
            width={20}
            fill={Colors.white}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} /> // placeholder
      )}
    </View>
  );

  // ---------------------------------------------------------------------------
  // Navigation buttons (Back, Next, Get Started)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaView style={IntroStyle.container}>
      <LinearGradient
        colors={slides[currentSlide].gradient}
        style={IntroStyle.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Particle background effect */}
        <Components.ParticleBackground />

        {/* Main animated content */}
        <Animated.View
          style={[
            IntroStyle.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Slide carousel */}
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

          {/* Pagination + Buttons */}

          {renderPaginationWithArrows()}

          {/* Skip option (only before last slide) */}
          {/* Skip / Get Started button */}
          <TouchableOpacity
            style={IntroStyle.skipButton}
            onPress={handleGetStarted}
          >
            <Text style={IntroStyle.skipButtonText}>
              {currentSlide === slides.length - 1
                ? '🚀 Get Started'
                : 'Skip Introduction'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Intro;
