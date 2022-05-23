// Copyright 2016-2022, University of Colorado Boulder

/**
 * Intro model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import ConstantMode from '../../common/model/ConstantMode.js';
import MassesAndSpringsModel from '../../common/model/MassesAndSpringsModel.js';
import SceneMode from '../../common/model/SceneMode.js';
import massesAndSprings from '../../massesAndSprings.js';

class IntroModel extends MassesAndSpringsModel {
  /**
   * @param {Tandem} tandem
   *
   */
  constructor( tandem ) {

    super( tandem );
    this.basicsVersion = false;

    // Set initial springs and masses
    this.addDefaultSprings( tandem );
    this.addDefaultMasses( tandem );

    // @public {Property.<string|null>} determines which spring property to keep constant in the constants panel
    this.constantModeProperty = new EnumerationDeprecatedProperty( ConstantMode, ConstantMode.SPRING_CONSTANT, {
      tandem: tandem.createTandem( 'constantModeProperty' )
    } );

    // @public {EnumerationDeprecatedProperty.<SceneModeEnum>} determines the scene selection for the intro screen
    this.sceneModeProperty = new EnumerationDeprecatedProperty( SceneMode, SceneMode.SAME_LENGTH, {
      tandem: tandem.createTandem( 'sceneModeProperty' )
    } );

    // @public {Spring} Renamed for readability. Springs are constantly referenced.
    this.spring1 = this.springs[ 0 ];
    this.spring2 = this.springs[ 1 ];

    // We are updating the spring thickness for each spring, whenever we are on the first scene
    this.springs.forEach( spring => {
      spring.springConstantProperty.link( springConstant => {
        if ( this.sceneModeProperty.get() === SceneMode.SAME_LENGTH ) {
          spring.updateThickness( spring.naturalRestingLengthProperty.get(), springConstant );
        }
      } );
    } );

    // Array of parameters for scene 1
    let sameLengthModeSpringState = this.getSpringState();

    // Array of parameters for scene 2
    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
    let adjustableLengthModeSpringState = this.getSpringState();

    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );

    // Link that is responsible for switching the scenes
    this.sceneModeProperty.lazyLink( scene => {
      if ( scene === SceneMode.SAME_LENGTH ) {

        // Manages stashing and applying parameters to each scene
        this.resetScene( true );

        // reset the spring stop buttons
        this.spring1.buttonEnabledProperty.reset();
        this.spring2.buttonEnabledProperty.reset();

        // save the state of the adjustable length scene
        adjustableLengthModeSpringState = this.getSpringState();
        this.setSpringState( sameLengthModeSpringState );
      }

      else if ( scene === SceneMode.ADJUSTABLE_LENGTH ) {

        // Manages stashing and applying parameters to each scene
        this.resetScene( true );

        // Reset the spring stop buttons
        this.spring1.buttonEnabledProperty.reset();
        this.spring2.buttonEnabledProperty.reset();

        // save the state of the same length scene
        sameLengthModeSpringState = this.getSpringState();
        this.setSpringState( adjustableLengthModeSpringState );
      }
    } );

    // Manages logic for updating spring thickness and spring constant
    this.spring1.naturalRestingLengthProperty.link( naturalRestingLength => {

      // Functions used to determine the inverse relationship between the length and springConstant/thickness
      // SpringConstant = constant --> As length increases, spring thickness decreases (and vice versa)
      // Thickness = constant --> As length increases, spring constant decreases  (and vice versa)
      if ( this.constantModeProperty.get() === this.constantModeProperty.SPRING_CONSTANT ) {
        this.spring1.updateThickness( naturalRestingLength, this.spring1.springConstantProperty.get() );
      }
      else if ( this.constantModeProperty.get() === this.constantModeProperty.SPRING_THICKNESS ) {
        this.spring1.updateSpringConstant( naturalRestingLength, this.spring1.thicknessProperty.get() );
      }
    } );

    Multilink.multilink( [ this.constantModeProperty, this.sceneModeProperty ], ( selectedConstant, scene ) => {

      // Only adjust thickness/springConstant on adjustableLength scene
      if ( scene === SceneMode.ADJUSTABLE_LENGTH ) {

        // Manages logic for changing between constant parameters
        if ( selectedConstant === ConstantMode.SPRING_CONSTANT ) {
          this.spring1.springConstantProperty.reset();
          this.spring1.updateThickness( this.spring1.naturalRestingLengthProperty.get(), this.spring1.springConstantProperty.get() );
        }
        else if ( selectedConstant === ConstantMode.SPRING_THICKNESS ) {
          this.spring1.thicknessProperty.reset();
          this.spring1.updateSpringConstant( this.spring1.naturalRestingLengthProperty.get(), this.spring1.thicknessProperty.get() );
        }
      }
    } );
  }


  /**
   * @override
   *
   * @public
   */
  reset() {
    super.reset();

    this.sceneModeProperty.reset();
    this.constantModeProperty.reset();
    this.initializeScenes();
  }

  /**
   * Responsible for preserving the properties of the masses and springs then stores them in a mutable object.
   *
   * @private
   */
  getSpringState() {
    return {
      spring1State: this.spring1.getSpringState(),
      spring2State: this.spring2.getSpringState()
    };
  }

  /**
   * Responsible for setting the properties of the masses and springs.
   * @param {Object} sceneState: Contains properties of springs and masses. See getSpringState().
   *
   * @private
   */
  setSpringState( sceneState ) {
    this.spring1.setSpringState( sceneState.spring1State );
    this.spring2.setSpringState( sceneState.spring2State );
  }

  /**
   * Resets the properties of the masses and springs. The entire sim isn't reset, just the properties affectign the
   * masses and the springs.
   * @private
   *
   * @param {boolean} massesOnly
   */
  resetScene( massesOnly ) {
    if ( massesOnly === false ) {
      this.spring1.reset();
      this.spring2.reset();
    }

    this.masses.forEach( mass => {
      mass.reset();
    } );

    // We are resetting the springs' displacement Property to recalculate an appropriate length (derived property)
    this.springs.forEach( spring => {
      if ( spring.massAttachedProperty.get() ) {
        spring.massAttachedProperty.reset();
        spring.displacementProperty.reset();
      }
    } );
  }

  /**
   * Resets both scenes of intro screen to initial sim state. This resets only the properties affecting the masses
   * and the springs.
   *
   * @private
   */
  initializeScenes() {
    this.sceneModeProperty.set( SceneMode.ADJUSTABLE_LENGTH );
    this.resetScene( false );
    this.spring1.naturalRestingLengthProperty.set( 0.25 );

    // initial parameters set for both scenes
    this.sceneModeProperty.set( SceneMode.SAME_LENGTH );
    this.resetScene( false );
  }
}

massesAndSprings.register( 'IntroModel', IntroModel );

export default IntroModel;