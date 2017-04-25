// Copyright 2016-2017, University of Colorado Boulder

/**
 * Intro model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Property = require( 'AXON/Property' );

  // phet-io modules
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * TODO:: There has to be a better way to manage all of these properties as one entity without using propertySet()
   * @constructor
   */
  function IntroModel( tandem ) {

    MassesAndSpringsModel.call( this, tandem );
    var self = this;

    //TODO: Move into the intro Model.
    // @public {Property.<string>} determines the scene selection for the intro screen
    this.sceneModeProperty = new Property( 'same-length', {
      tandem: tandem.createTandem( 'sceneModeProperty' ),
      phetioValueType: TString,
      validValues: [ 'same-length', 'adjustable-length' ]
    } );

    // @public {Property.<string|null>} determines which spring property to keep constant in the constants panel
    this.constantParameterProperty = new Property( 'spring-constant', {
      tandem: tandem.createTandem( 'constantParameterProperty' ),
      phetioValueType: TString,
      validValues: [ 'spring-constant', 'spring-thickness', null ]
    } );

    // Renamed for readability. Springs are constantly referenced.
    this.spring1 = this.springs[ 0 ];
    this.spring2 = this.springs[ 1 ];

    this.springs.forEach( function( spring ) {
      spring.springConstantProperty.link( function( springConstant ) {
        if ( self.sceneModeProperty.get() === 'same-length' ) {
          spring.updateThickness( spring.naturalRestingLengthProperty.get(), springConstant );
        }
      } );
    } );

    // initial parameters set for both scenes
    // @private {read-write} array of parameters for scene 1
    var scene1Parameters = this.getSceneState();

    // @private {read-write} array of parameters for scene 2
    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
    var scene2Parameters = this.getSceneState();

    this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );

    // Link that is responsible for switching the scenes
    this.sceneModeProperty.lazyLink( function( mode ) {
      /**Functions used to determine the inverse relationship between the length and springConstant/thickness
       Functions follow logic:
       -SpringConstant = constant --> As length increases, spring thickness decreases (and vice versa)
       -Thickness = constant -->As length increases, spring constant decreases  (and vice versa)
       */
      // Restoring spring parameters when scenes are switched
      if ( mode === 'same-length' ) {
        // Manages stashing and applying parameters to each scene
        scene2Parameters = self.getSceneState();
        self.setSceneState( scene1Parameters );
      }

      else if ( mode === 'adjustable-length' ) {
        // Manages stashing and applying parameters to each scene
        scene1Parameters = self.getSceneState();
        self.setSceneState( scene2Parameters );

        // Manages logic for updating spring thickness and spring constant
        self.spring1.naturalRestingLengthProperty.link( function( naturalRestingLength ) {
          if ( self.constantParameterProperty.get() === 'spring-constant' ) {
            self.spring1.updateThickness( naturalRestingLength, self.spring1.springConstantProperty.get() );
          }
          else if ( self.constantParameterProperty.get() === 'spring-thickness' ) {
            self.spring1.updateSpringConstant( naturalRestingLength, self.spring1.thicknessProperty.get() );
          }
        } );

        self.constantParameterProperty.link( function( selectedConstant ) {
          // Manages logic for changing between constant parameters
          // TODO: Enumerate these constants for checks
          if ( selectedConstant === 'spring-constant' ) {
            self.spring1.springConstantProperty.reset();
            self.spring1.updateThickness( self.spring1.naturalRestingLengthProperty.get(), self.spring1.springConstantProperty.get() );
          }
          else if ( selectedConstant === 'spring-thickness' ) {
            self.spring1.thicknessProperty.reset();
            self.spring1.updateSpringConstant( self.spring1.naturalRestingLengthProperty.get(), self.spring1.thicknessProperty.get() );
          }

        } );
      }
      // // Used for testing purposes
      // Property.multilink( [ self.spring1.springConstantProperty, self.spring1.thicknessProperty ], function( springConstant, springThickness ) {
      //
      //   console.log( 'springConstant = ' + springConstant + '\t\t' + 'thickness = ' + springThickness );
      // } );
    } );
  }

  massesAndSprings.register( 'IntroModel', IntroModel );

  return inherit( MassesAndSpringsModel, IntroModel, {

    /**
     * @override
     * @public
     */
    reset: function() {
      // debugger;
      MassesAndSpringsModel.prototype.reset.call( this );
      this.sceneModeProperty.reset();
      this.constantParameterProperty.reset();
      this.applyResetParameters();
      console.log( 'Reset called' );
    },

    getSceneState: function() {
      var spring1State = this.spring1.getSpringState();
      var spring2State = this.spring2.getSpringState();
      var largeLabeledMassState = this.masses.largeLabeledMass.getMassState();
      var mediumLabeledMass1State = this.masses.mediumLabeledMass1.getMassState();
      var mediumLabeledMass2State = this.masses.mediumLabeledMass2.getMassState();
      var smallLabeledMassState = this.masses.smallLabeledMass.getMassState();
      var largeUnlabeledMass = this.masses.largeUnlabeledMass.getMassState();
      var mediumUnlabeledMass = this.masses.mediumUnlabeledMass.getMassState();
      var smallUnlabeledMass = this.masses.smallUnlabeledMass.getMassState();
      var sceneState = {
        spring1State: spring1State,
        spring2State: spring2State,
        largeLabeledMassState: largeLabeledMassState,
        mediumLabeledMass1State: mediumLabeledMass1State,
        mediumLabeledMass2State: mediumLabeledMass2State,
        smallLabeledMassState: smallLabeledMassState,
        largeUnlabeledMass: largeUnlabeledMass,
        mediumUnlabeledMass: mediumUnlabeledMass,
        smallUnlabeledMass: smallUnlabeledMass
      };
      return sceneState;

    },

    setSceneState: function( sceneState ) {
      this.spring1.setSpringState( sceneState.spring1State );
      this.spring2.setSpringState( sceneState.spring2State );
      this.masses.largeLabeledMass.setMassState( sceneState.largeLabeledMassState );
      this.masses.mediumLabeledMass1.setMassState( sceneState.mediumLabeledMass1State );
      this.masses.mediumLabeledMass2.setMassState( sceneState.mediumLabeledMass2State );
      this.masses.smallLabeledMass.setMassState( sceneState.smallLabeledMassState );
      this.masses.largeUnlabeledMass.setMassState( sceneState.largeUnlabeledMass );
      this.masses.mediumUnlabeledMass.setMassState( sceneState.mediumUnlabeledMass );
      this.masses.smallUnlabeledMass.setMassState( sceneState.smallUnlabeledMass );
    },

    resetSceneParameters: function() {

      if ( this.sceneModeProperty.get() === 'same-length' ) {
        this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );
      }
      else if ( this.sceneModeProperty.get() === 'adjustable-length' ) {
        this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
      }
      console.log( 'reset' );

      // Applying stashed parameters of first spring
      this.spring1.displacementProperty.reset();
      this.spring1.gravityProperty.reset();
      this.spring1.dampingCoefficientProperty.reset();
      this.spring1.positionProperty.reset();
      this.spring1.naturalRestingLengthProperty.reset();
      this.spring1.animatingProperty.reset();
      this.spring1.massProperty.reset();
      this.spring1.springConstantProperty.reset();

      // Applying stashed parameters of first spring
      this.spring2.displacementProperty.reset();
      this.spring2.gravityProperty.reset();
      this.spring2.dampingCoefficientProperty.reset();
      this.spring2.positionProperty.reset();
      this.spring2.animatingProperty.reset();
      this.spring2.massProperty.reset();
      this.spring2.springConstantProperty.reset();
      this.spring2.thicknessProperty.reset();

      // Applying stashed parameters of 250g grey mass
      this.masses.largeLabeledMass.reset();

      // Applying stashed parameters of first 100g grey mass
      this.masses.mediumLabeledMass1.reset();

      // Applying stashed parameters of second 100g grey mass
      this.masses.mediumLabeledMass2.reset();

      // Applying stashed parameters of 50g grey mass
      this.masses.smallLabeledMass.reset();

      // Applying stashed parameters of 200g blue mass
      this.masses.largeUnlabeledMass.reset();

      // Applying stashed parameters of 150g green mass
      this.masses.mediumUnlabeledMass.reset();

      // Applying stashed parameters of 75g red mass
      this.masses.smallUnlabeledMass.reset();
    },

    applyResetParameters: function() {
      // apply reset parameters to each scene
      this.sceneModeProperty.set( 'adjustable-length' );
      this.resetSceneParameters();
      this.scene1Parameters = this.getSceneState();

      this.sceneModeProperty.set( 'same-length' );

      // initial parameters set for both scenes
      // @private {read-write} array of parameters for scene 1
      this.sceneModeProperty.set( 'same-length' );
      this.resetSceneParameters();

      // @private {read-write} array of parameters for scene 2
      this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );

      this.spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );
    }
  } );
} );
