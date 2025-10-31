import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Typography, Tabs, Slider, Select, Space, Tag, Tooltip, Alert } from 'antd';
import { 
  ArrowsAltOutlined, 
  ShrinkOutlined, 
  CameraOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const { Title, Text } = Typography;
const { Option } = Select;

interface ARVisualizationProps {
  policyData: any;
  onClose: () => void;
}

const ARVisualization: React.FC<ARVisualizationProps> = ({ policyData, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [arSupported, setArSupported] = useState(false);
  const [activeTab, setActiveTab] = useState('3d');
  const [visualizationMode, setVisualizationMode] = useState('city');
  const [timeScale, setTimeScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const modelRef = useRef<THREE.Group>();
  const animationRef = useRef<number>();

  // Check for WebXR support
  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        setArSupported(supported);
      }).catch(() => {
        setArSupported(false);
      });
    }
  }, []);

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f2f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = arSupported;
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a simple city model or other visualization
    const createCityModel = () => {
      const city = new THREE.Group();
      
      // Create buildings
      const buildingGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
      const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
      
      for (let i = 0; i < 20; i++) {
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.x = (Math.random() - 0.5) * 10;
        building.position.z = (Math.random() - 0.5) * 10;
        building.position.y = building.geometry.parameters.height / 2;
        building.scale.y = 0.5 + Math.random() * 2;
        city.add(building);
      }
      
      // Add ground
      const groundGeometry = new THREE.PlaneGeometry(20, 20);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7cba92,
        roughness: 0.8,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      city.add(ground);
      
      return city;
    };

    // Load 3D model based on visualization mode
    const loadModel = async () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }

      let model;
      if (visualizationMode === 'city') {
        model = createCityModel();
      } else {
        // Load other models based on mode
        model = new THREE.Group();
        // Add placeholder geometry
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x1890ff,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        model.add(mesh);
      }
      
      scene.add(model);
      modelRef.current = model;
      setLoading(false);
    };

    loadModel();

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.002 * timeScale;
      }
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
      animationRef.current = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      // Dispose of geometries and materials
      scene.traverse((object: any) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: THREE.Material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, [arSupported, visualizationMode, timeScale]);

  const handleARButtonClick = () => {
    if (!arSupported || !rendererRef.current) return;
    
    // Request AR session
    navigator.xr?.requestSession('immersive-ar').then((session) => {
      // Set up AR session
      rendererRef.current?.xr.setSession(session);
      
      // Add AR-specific setup here
      // This would include adding AR hit testing, anchors, etc.
      
      // Start animation loop for AR
      const animateAR = () => {
        rendererRef.current?.setAnimationLoop(() => {
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
        });
      };
      
      animateAR();
      
      // Handle session end
      session.addEventListener('end', () => {
        rendererRef.current?.setAnimationLoop(null);
      });
    }).catch((error) => {
      console.error('AR session failed:', error);
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const takeScreenshot = () => {
    if (!rendererRef.current) return;
    
    // Create a temporary link to download the screenshot
    const link = document.createElement('a');
    link.download = 'policy-visualization.png';
    link.href = rendererRef.current.domElement.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EnvironmentOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>Policy Impact Visualization</Title>
        </div>
        <Space>
          <Button 
            icon={<CameraOutlined />} 
            onClick={takeScreenshot}
            title="Take screenshot"
          />
          <Button 
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          />
          <Button onClick={onClose}>Close</Button>
        </Space>
      </div>
      
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            <Space style={{ marginLeft: 16 }}>
              <Select
                value={visualizationMode}
                onChange={setVisualizationMode}
                style={{ width: 180 }}
                suffixIcon={<SwapOutlined />}
              >
                <Option value="city">City Model</Option>
                <Option value="economic">Economic Indicators</Option>
                <Option value="environmental">Environmental Impact</Option>
                <Option value="social">Social Impact</Option>
              </Select>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 200 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Time Scale:</Text>
                <Slider 
                  min={0.1} 
                  max={5} 
                  step={0.1} 
                  value={timeScale} 
                  onChange={setTimeScale}
                  style={{ flex: 1 }}
                  tooltip={{ formatter: (value) => `${value}x` }}
                />
              </div>
              
              {arSupported && (
                <Button 
                  type="primary" 
                  onClick={handleARButtonClick}
                  icon={<ArrowsAltOutlined />}
                >
                  View in AR
                </Button>
              )}
            </Space>
          }
        >
          <Tabs.TabPane tab="3D Visualization" key="3d" />
          <Tabs.TabPane tab="Data Layers" key="layers" />
          <Tabs.TabPane tab="Simulation" key="simulation" />
        </Tabs>
      </div>
      
      {showHelp && (
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <InfoCircleOutlined />
              <span>Tip: Use your mouse to rotate, scroll to zoom, and right-click to pan the 3D view.</span>
            </div>
          }
          type="info"
          showIcon={false}
          closable
          onClose={() => setShowHelp(false)}
          style={{ margin: '0 16px', marginTop: 8 }}
        />
      )}
      
      <div 
        ref={containerRef} 
        style={{ 
          flex: 1, 
          position: 'relative',
          backgroundColor: '#f0f2f5',
          overflow: 'hidden'
        }}
      >
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 10
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '24px', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              textAlign: 'center'
            }}>
              <BarChartOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
              <Title level={4} style={{ marginBottom: 8 }}>Loading Visualization</Title>
              <Text type="secondary">Preparing the 3D environment...</Text>
            </div>
          </div>
        )}
        
        {!arSupported && activeTab === '3d' && (
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 4,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            zIndex: 5
          }}>
            <InfoCircleOutlined />
            <span>AR not supported in your browser</span>
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '12px 16px', 
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Policy Impact</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: policyData?.impact === 'positive' ? '#52c41a' : '#ff4d4f' 
              }} />
              <Text strong>{policyData?.impact === 'positive' ? 'Positive' : 'Negative'}</Text>
            </div>
          </div>
          
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Confidence</Text>
            <Text strong>{(policyData?.confidence || 0.85 * 100).toFixed(0)}%</Text>
          </div>
        </div>
        
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>Visualization Mode</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag color="blue">{visualizationMode.charAt(0).toUpperCase() + visualizationMode.slice(1)}</Tag>
            <Tooltip title="Change visualization mode">
              <Button 
                size="small" 
                icon={<SwapOutlined />} 
                onClick={() => {
                  const modes = ['city', 'economic', 'environmental', 'social'];
                  const currentIndex = modes.indexOf(visualizationMode);
                  setVisualizationMode(modes[(currentIndex + 1) % modes.length]);
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARVisualization;
