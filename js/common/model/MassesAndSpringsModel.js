// Copyright 2016-2017, University of Colorado Boulder

/**
 * Common model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // constants
  var GRABBING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be connected to
                               // a spring
  var DROPPING_DISTANCE = 0.1; // {number} horizontal distance in meters from a mass where a spring will be released

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * TODO:: There has to be a better way to manage all of these properties as one entity without using propertySet()
   * @constructor
   */
  function MassesAndSpringsModel( tandem ) {
    var self = this;

    // @public {Property.<boolean>} determines whether the sim is in a play/pause state
    this.playingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'playingProperty' )
    } );

    // @public {Property.<number>} c - coefficient of friction
    // TODO: Once range is decided for frictionProperty, pass in as range property for TNumber()
    this.frictionProperty = new NumberProperty( 0.2, {
      range: null,
      tandem: tandem.createTandem( 'frictionProperty' ),
      phetioValueType: TNumber()
    } );

    // @public {Property.<number>} a - gravitational acceleration (positive)
    this.gravityProperty = new Property( Body.EARTH.gravity, {
      range: new RangeWithValue( 0, 30, Body.EARTH.gravity ),
      tandem: tandem.createTandem( 'gravityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second/second',
        range: new RangeWithValue( 0, 30, Body.EARTH.gravity )
      } )
    } );

    // @public {Property.<string>} determines the speed at which the sim plays.
    this.simSpeedProperty = new Property( 'normal', {
      tandem: tandem.createTandem( 'simSpeedProperty' ),
      phetioValueType: TString,
      validValues: [ 'slow', 'normal' ]
    } );

    //TODO: Move into the intro Model.
    // @public {Property.<string>} determines the scene selection for the intro screen
    this.springLengthModeProperty = new Property( 'same-length', {
      tandem: tandem.createTandem( 'springLengthModeProperty' ),
      phetioValueType: TString,
      validValues: [ 'same-length', 'adjustable-length' ]
    } );

    // @public {Property.<boolean>} determines visibility of ruler node
    this.rulerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rulerVisibleProperty' )
    } );

    // TODO: This is specific to Intro Screen. Move to Intro Model. Refactor into "constantParameter"
    // @public {Property.<string|null>} determines which spring property to keep constant in the constants panel
    this.selectedConstantProperty = new Property( 'spring-constant', {
      tandem: tandem.createTandem( 'selectedConstantProperty' ),
      phetioValueType: TString,
      validValues: [ 'spring-constant', 'spring-thickness', null ]
    } );

    // @public {Property.<boolean>} determines visibility of timer node
    this.timerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerVisibleProperty' )
    } );

    // @public {Property.<number>} elapsed time shown in the timer (rounded off to the nearest second)
    this.timerSecondProperty = new NumberProperty( 0, {
      range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 ),
      tandem: tandem.createTandem( 'timerSecondProperty' ),
      phetioValueType: TNumber( {
        units: 'seconds',
        range: new RangeWithValue( 0, Number.POSITIVE_INFINITY, 0 )
      } )
    } );

    // @public {Property.<boolean>} determines whether timer is active or not
    this.timerRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerRunningPropertyProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of movable line node
    this.movableLineVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'movableLineVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of equilibrium line node
    this.equilibriumPositionVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'equilibriumPositionVisibleProperty' )
    } );

    // @public {Property.<boolean>} determines visibility of natural length line node
    this.naturalLengthVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'naturalLengthVisibleProperty' )
    } );

    // @public {Property.<string>}
    this.bodyTitleProperty = new Property( Body.EARTH.title, {
      tandem: tandem.createTandem( 'bodyTitleProperty' ),
      phetioValueType: TString
    } );

    // @public {read-only} Y position of floor in m. The floor is at the bottom bounds of the screen.
    this.floorY = 0;

    // @public {read-only} Y position of ceiling in m.  The ceiling is at the top of the SpringHangerNode,
    // just below the top of the dev view bounds
    this.ceilingY = 1.23;

    // @public (read-only) model of springs used throughout the sim
    // TODO:: See if other places need (read-only) too
    this.springs = [
      new Spring( new Vector2( .65, this.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), this.frictionProperty.get(), tandem.createTandem( 'leftSpring' ) ),
      new Spring( new Vector2( .95, this.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), this.frictionProperty.get(), tandem.createTandem( 'rightSpring' ) )
    ];

    // @public (read-only) model of masses used throughout the sim
    this.masses = [
      new Mass( .250, new Vector2( .12, .5 ), true, 'grey', tandem.createTandem( 'largeLabeledMass' ) ),
      new Mass( .100, new Vector2( .20, .5 ), true, 'grey', tandem.createTandem( 'mediumLabeledMass1' ) ),
      new Mass( .100, new Vector2( .28, .5 ), true, 'grey', tandem.createTandem( 'mediumLabeledMass2' ) ),
      new Mass( .050, new Vector2( .33, .5 ), true, 'grey', tandem.createTandem( 'smallLabeledMass' ) ),
      new Mass( .200, new Vector2( .63, .5 ), false, 'blue', tandem.createTandem( 'largeUnlabeledMass' ) ),
      new Mass( .150, new Vector2( .56, .5 ), false, 'green', tandem.createTandem( 'mediumUnlabeledMass' ) ),
      new Mass( .075, new Vector2( .49, .5 ), false, 'red', tandem.createTandem( 'smallUnlabeledMass' ) )
    ];

    // @public (read-only) model of bodies used throughout the sim
    this.bodies = [
      Body.MOON,
      Body.EARTH,
      Body.JUPITER,
      Body.PLANET_X,
      Body.ZERO_G,
      Body.CUSTOM
    ];
    this.gravityRange = new RangeWithValue( 0, 30, 9.8 );

    this.gravityProperty.link( function( newGravity ) {
      assert && assert( newGravity >= 0, 'gravity must be 0 or positive : ' + newGravity );
      self.springs.forEach( function( spring ) {
        spring.gravityProperty.set( newGravity );
      } );
    } );

    this.frictionProperty.link( function( newFriction ) {
      assert && assert( newFriction >= 0, 'friction must be greater than or equal to 0: ' + newFriction );
      self.springs.forEach( function( spring ) {
        spring.dampingCoefficientProperty.set( newFriction );
      } );
    } );

    // TODO: Move into intro model.
    this.springs.forEach( function( spring ) {
      spring.springConstantProperty.link( function( springConstant ) {
        if ( self.springLengthModeProperty.get() === 'same-length' ) {
          spring.updateThickness( spring.naturalRestingLengthProperty.get(), springConstant );
        }
      } );
    } );
  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( Object, MassesAndSpringsModel, {

    /**
     * @override
     * @public
     */
    reset: function() {
      this.frictionProperty.reset();
      this.gravityProperty.reset();
      this.playingProperty.reset();
      this.simSpeedProperty.reset();
      this.rulerVisibleProperty.reset();
      this.selectedConstantProperty.reset();
      this.springLengthModeProperty.reset();
      this.timerVisibleProperty.reset();
      this.timerSecondProperty.reset();
      this.timerRunningProperty.reset();
      this.movableLineVisibleProperty.reset();
      this.naturalLengthVisibleProperty.reset();
      this.equilibriumPositionVisibleProperty.reset();
      this.masses.forEach( function( mass ) { mass.reset(); } );
      this.springs.forEach( function( spring ) { spring.reset(); } );
    },

    /**
     *  Based on new dragged position of mass, try to attach or detach mass if eligible and then update position.
     *
     * @public
     *
     * @param {Mass} mass
     * @param {Vector2} proposedPosition
     */
    adjustDraggedMassPosition: function( mass, proposedPosition ) {
      // Attempt to detach
      if ( mass.springProperty.get() && Math.abs( proposedPosition.x - mass.positionProperty.get().x ) > DROPPING_DISTANCE ) {
        mass.springProperty.get().removeMass();
        mass.detach();
      }
      // Update mass position and spring length if attached
      if ( mass.springProperty.get() ) {
        mass.springProperty.get().displacementProperty.set( -( mass.springProperty.get().positionProperty.get().y -
                                                               mass.springProperty.get().naturalRestingLengthProperty.get() ) + proposedPosition.y );
        mass.positionProperty.set( new Vector2( mass.springProperty.get().positionProperty.get().x, proposedPosition.y ) );
      }
      // Update mass position if unattached
      else {
        //Attempt to attach
        this.springs.forEach( function( spring ) {
          if ( Math.abs( proposedPosition.x - spring.positionProperty.get().x ) < GRABBING_DISTANCE &&
               Math.abs( proposedPosition.y - spring.bottomProperty.get() ) < GRABBING_DISTANCE &&
               spring.massProperty.get() === null ) {
            spring.addMass( mass );
          }
        } );
        //Update position
        mass.positionProperty.set( proposedPosition );
      }
    },

    // TODO: Move to IntroModel
    stashSceneParameters: function() {
      // @private {read-only} Stashing parameters for first spring
      var sceneSpring1Properties = {
        displacement: this.springs[ 0 ].displacementProperty.get(),
        gravity: this.springs[ 0 ].gravityProperty.get(),
        dampingCoefficient: this.springs[ 0 ].dampingCoefficientProperty.get(),
        position: this.springs[ 0 ].positionProperty.get(),
        naturalRestingLength: this.springs[ 0 ].naturalRestingLengthProperty.get(),
        animating: this.springs[ 0 ].animatingProperty.get(),
        mass: this.springs[ 0 ].massProperty.get(),
        springConstant: this.springs[ 0 ].springConstantProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to first spring
      if ( this.springs[ 0 ].massProperty.get() ) {
        var sceneSpring1MassProperties = {
          mass: this.springs[ 0 ].massProperty.get().mass,
          position: this.springs[ 0 ].massProperty.get().positionProperty.get(),
          userControlledProperty: this.springs[ 0 ].massProperty.get().userControlledProperty.get(),
          verticalVelocity: this.springs[ 0 ].massProperty.get().verticalVelocityProperty.get(),
          spring: this.springs[ 0 ].massProperty.get().springProperty.get()
        };
      }

      // @private {read-only} Stashing parameters for first spring
      var sceneSpring2Properties = {
        displacement: this.springs[ 1 ].displacementProperty.get(),
        gravity: this.springs[ 1 ].gravityProperty.get(),
        dampingCoefficient: this.springs[ 1 ].dampingCoefficientProperty.get(),
        position: this.springs[ 1 ].positionProperty.get(),
        naturalRestingLength: this.springs[ 1 ].naturalRestingLengthProperty.get(),
        animating: this.springs[ 1 ].animatingProperty.get(),
        mass: this.springs[ 1 ].massProperty.get(),
        springConstant: this.springs[ 1 ].springConstantProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to first spring
      if ( this.springs[ 1 ].massProperty.get() ) {
        var sceneSpring2MassProperties = {
          mass: this.springs[ 1 ].massProperty.get().mass,
          position: this.springs[ 1 ].massProperty.get().positionProperty.get(),
          userControlledProperty: this.springs[ 1 ].massProperty.get().userControlledProperty.get(),
          verticalVelocity: this.springs[ 1 ].massProperty.get().verticalVelocityProperty.get(),
          spring: this.springs[ 1 ].massProperty.get().springProperty.get()
        };
      }

      // @private {read-only} Stashing parameters for mass attached to 250g grey mass
      var sceneMass1 = {
        mass: this.masses[ 0 ].mass,
        position: this.masses[ 0 ].positionProperty.get(),
        userControlled: this.masses[ 0 ].userControlledProperty.get(),
        verticalVelocity: this.masses[ 0 ].verticalVelocityProperty.get(),
        spring: this.masses[ 0 ].springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to first 100g grey mass
      var sceneMass2 = {
        mass: this.masses[ 1 ].mass,
        position: this.masses[ 1 ].positionProperty.get(),
        userControlled: this.masses[ 1 ].userControlledProperty.get(),
        verticalVelocity: this.masses[ 1 ].verticalVelocityProperty.get(),
        spring: this.masses[ 1 ].springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to second 100g grey mass
      var sceneMass3 = {
        mass: this.masses[ 2 ].mass,
        position: this.masses[ 2 ].positionProperty.get(),
        userControlled: this.masses[ 2 ].userControlledProperty.get(),
        verticalVelocity: this.masses[ 2 ].verticalVelocityProperty.get(),
        spring: this.masses[ 2 ].springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 50g grey mass
      var sceneMass4 = {
        mass: this.masses[ 3 ].mass,
        position: this.masses[ 3 ].positionProperty.get(),
        userControlled: this.masses[ 3 ].userControlledProperty.get(),
        verticalVelocity: this.masses[ 3 ].verticalVelocityProperty.get(),
        spring: this.masses[ 3 ].springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 200g blue mass
      var sceneMass5 = {
        mass: this.masses[ 4 ].mass,
        position: this.masses[ 4 ].positionProperty.get(),
        userControlled: this.masses[ 4 ].userControlledProperty.get(),
        verticalVelocity: this.masses[ 4 ].verticalVelocityProperty.get(),
        spring: this.masses[ 4 ].springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 150g green mass
      var sceneMass6 = {
        mass: this.masses[ 5 ].mass,
        position: this.masses[ 5 ].positionProperty.get(),
        userControlled: this.masses[ 5 ].userControlledProperty.get(),
        verticalVelocity: this.masses[ 5 ].verticalVelocityProperty.get(),
        spring: this.masses[ 5 ].springProperty.get()
      };

      // @private {read-only} Stashing parameters for mass attached to 75g red mass
      var sceneMass7 = {
        mass: this.masses[ 6 ].mass,
        position: this.masses[ 6 ].positionProperty.get(),
        userControlled: this.masses[ 6 ].userControlledProperty.get(),
        verticalVelocity: this.masses[ 6 ].verticalVelocityProperty.get(),
        spring: this.masses[ 6 ].springProperty.get()
      };

      // @private {read-only} Stashing sceneMasses into one object
      var massesState = {
        sceneMass1: sceneMass1,
        sceneMass2: sceneMass2,
        sceneMass3: sceneMass3,
        sceneMass4: sceneMass4,
        sceneMass5: sceneMass5,
        sceneMass6: sceneMass6,
        sceneMass7: sceneMass7
      };

      // @private {read-only} Stashing spring 1 parameters into one object
      var spring1State = {
        sceneSpring1: sceneSpring1Properties,
        sceneSpring1Mass: sceneSpring1MassProperties
      };

      // @private {read-only} Stashing spring 2 parameters into one object
      var spring2State = {
        sceneSpring2: sceneSpring2Properties,
        sceneSpring2Mass: sceneSpring2MassProperties
      };

      // @public {read-only} Array that contains all of the parameters associated with the spring and mass states
      var parameters = [ spring1State, spring2State, massesState ];

      return parameters;
    },

    // TODO: Move to IntroModel
    // TODO: Create object structure and provide loop for applying parameters
    applySceneParameters: function( parameters ) {
      // Applying stashed parameters of first spring
      this.springs[ 0 ].displacementProperty.set( parameters[ 0 ].sceneSpring1.displacement );
      this.springs[ 0 ].gravityProperty.set( parameters[ 0 ].sceneSpring1.gravity );
      this.springs[ 0 ].dampingCoefficientProperty.set( parameters[ 0 ].sceneSpring1.dampingCoefficient );
      this.springs[ 0 ].positionProperty.set( parameters[ 0 ].sceneSpring1.position );
      this.springs[ 0 ].naturalRestingLengthProperty.set( parameters[ 0 ].sceneSpring1.naturalRestingLength );
      this.springs[ 0 ].animatingProperty.set( parameters[ 0 ].sceneSpring1.animating );
      this.springs[ 0 ].massProperty.set( parameters[ 0 ].sceneSpring1.mass );
      this.springs[ 0 ].springConstantProperty.set( parameters[ 0 ].sceneSpring1.springConstant );

      // Handle applying stashed parameters of first spring if mass is attached
      if ( this.springs[ 0 ].massProperty.get() ) {
        this.springs[ 0 ].massProperty.get().mass = parameters[ 0 ].sceneSpring1Mass.mass;
        this.springs[ 0 ].massProperty.get().positionProperty.set( parameters[ 0 ].sceneSpring1Mass.position );
        this.springs[ 0 ].massProperty.get().userControlledProperty.set( parameters[ 0 ].sceneSpring1Mass.userControlledProperty );
        this.springs[ 0 ].massProperty.get().verticalVelocityProperty.set( parameters[ 0 ].sceneSpring1Mass.verticalVelocity );
        this.springs[ 0 ].massProperty.get().springProperty.set( parameters[ 0 ].sceneSpring1Mass.spring );
      }
      // Applying stashed parameters of first spring
      this.springs[ 1 ].displacementProperty.set( parameters[ 1 ].sceneSpring2.displacement );
      this.springs[ 1 ].gravityProperty.set( parameters[ 1 ].sceneSpring2.gravity );
      this.springs[ 1 ].dampingCoefficientProperty.set( parameters[ 1 ].sceneSpring2.dampingCoefficient );
      this.springs[ 1 ].positionProperty.set( parameters[ 1 ].sceneSpring2.position );
      this.springs[ 1 ].naturalRestingLengthProperty.set( parameters[ 1 ].sceneSpring2.naturalRestingLength );
      this.springs[ 1 ].animatingProperty.set( parameters[ 1 ].sceneSpring2.animating );
      this.springs[ 1 ].massProperty.set( parameters[ 1 ].sceneSpring2.mass );
      this.springs[ 1 ].springConstantProperty.set( parameters[ 1 ].sceneSpring2.springConstant );

      // Handle applying stashed parameters of first spring if mass is attached
      if ( this.springs[ 1 ].massProperty.get() ) {
        this.springs[ 1 ].massProperty.get().mass = parameters[ 1 ].sceneSpring2Mass.mass;
        this.springs[ 1 ].massProperty.get().positionProperty.set( parameters[ 1 ].sceneSpring2Mass.position );
        this.springs[ 1 ].massProperty.get().userControlledProperty.set( parameters[ 1 ].sceneSpring2Mass.userControlledProperty );
        this.springs[ 1 ].massProperty.get().verticalVelocityProperty.set( parameters[ 1 ].sceneSpring2Mass.verticalVelocity );
        this.springs[ 1 ].massProperty.get().springProperty.set( parameters[ 1 ].sceneSpring2Mass.spring );
      }

      // Applying stashed parameters of 250g grey mass
      this.masses[ 0 ].mass = parameters[ 2 ].sceneMass1.mass;
      this.masses[ 0 ].positionProperty.set( parameters[ 2 ].sceneMass1.position );
      this.masses[ 0 ].userControlledProperty.set( parameters[ 2 ].sceneMass1.userControlled );
      this.masses[ 0 ].verticalVelocityProperty.set( parameters[ 2 ].sceneMass1.verticalVelocity );
      this.masses[ 0 ].springProperty.set( parameters[ 2 ].sceneMass1.spring );

      // Applying stashed parameters of first 100g grey mass
      this.masses[ 1 ].mass = parameters[ 2 ].sceneMass2.mass;
      this.masses[ 1 ].positionProperty.set( parameters[ 2 ].sceneMass2.position );
      this.masses[ 1 ].userControlledProperty.set( parameters[ 2 ].sceneMass2.userControlled );
      this.masses[ 1 ].verticalVelocityProperty.set( parameters[ 2 ].sceneMass2.verticalVelocity );
      this.masses[ 1 ].springProperty.set( parameters[ 2 ].sceneMass2.spring );

      // Applying stashed parameters of second 100g grey mass
      this.masses[ 2 ].mass = parameters[ 2 ].sceneMass3.mass;
      this.masses[ 2 ].positionProperty.set( parameters[ 2 ].sceneMass3.position );
      this.masses[ 2 ].userControlledProperty.set( parameters[ 2 ].sceneMass3.userControlled );
      this.masses[ 2 ].verticalVelocityProperty.set( parameters[ 2 ].sceneMass3.verticalVelocity );
      this.masses[ 2 ].springProperty.set( parameters[ 2 ].sceneMass3.spring );

      // Applying stashed parameters of 50g grey mass
      this.masses[ 3 ].mass = parameters[ 2 ].sceneMass4.mass;
      this.masses[ 3 ].positionProperty.set( parameters[ 2 ].sceneMass4.position );
      this.masses[ 3 ].userControlledProperty.set( parameters[ 2 ].sceneMass4.userControlled );
      this.masses[ 3 ].verticalVelocityProperty.set( parameters[ 2 ].sceneMass4.verticalVelocity );
      this.masses[ 3 ].springProperty.set( parameters[ 2 ].sceneMass4.spring );

      // Applying stashed parameters of 200g blue mass
      this.masses[ 4 ].mass = parameters[ 2 ].sceneMass5.mass;
      this.masses[ 4 ].positionProperty.set( parameters[ 2 ].sceneMass5.position );
      this.masses[ 4 ].userControlledProperty.set( parameters[ 2 ].sceneMass5.userControlled );
      this.masses[ 4 ].verticalVelocityProperty.set( parameters[ 2 ].sceneMass5.verticalVelocity );
      this.masses[ 4 ].springProperty.set( parameters[ 2 ].sceneMass5.spring );

      // Applying stashed parameters of 150g green mass
      this.masses[ 5 ].mass = parameters[ 2 ].sceneMass6.mass;
      this.masses[ 5 ].positionProperty.set( parameters[ 2 ].sceneMass6.position );
      this.masses[ 5 ].userControlledProperty.set( parameters[ 2 ].sceneMass6.userControlled );
      this.masses[ 5 ].verticalVelocityProperty.set( parameters[ 2 ].sceneMass6.verticalVelocity );
      this.masses[ 5 ].springProperty.set( parameters[ 2 ].sceneMass6.spring );

      // Applying stashed parameters of 75g red mass
      this.masses[ 6 ].mass = parameters[ 2 ].sceneMass7.mass;
      this.masses[ 6 ].positionProperty.set( parameters[ 2 ].sceneMass7.position );
      this.masses[ 6 ].userControlledProperty.set( parameters[ 2 ].sceneMass7.userControlled );
      this.masses[ 6 ].verticalVelocityProperty.set( parameters[ 2 ].sceneMass7.verticalVelocity );
      this.masses[ 6 ].springProperty.set( parameters[ 2 ].sceneMass7.spring );
    },

    /**
     * Stop spring motion by setting the displacement to the spring's extension, which is the length from the natural
     * resting position. This will also stop the spring from further oscillation.
     * @public
     *
     * @param {number} springNumber: Determines which spring will be affected.
     */
    stopSpring: function( springNumber ) {
      var spring = this.springs[ springNumber ];
      var mass = spring.massProperty.get();

      // check if mass attached on spring
      if ( mass ) {
        // for readability
        // set displacement and stop further animation
        spring.displacementProperty.set( -spring.springExtension );
        spring.animatingProperty.reset();

        // place that mass at the correct location as well
        mass.positionProperty.set( new Vector2( spring.positionProperty.get().x, spring.bottomProperty.get() ) );
      }
    },

    /**
     * @public
     */
    stepForward: function() {
      this.playingProperty.set( true );
      this.step( 1 / 60 );// steps the nominal amount used by step forward button listener
      this.playingProperty.set( false );
    },

    /**
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      var self = this;

      // If simulationTimeStep is excessively large, ignore it - it probably means the user returned to the tab after
      // the tab or the browser was hidden for a while.
      if ( dt > 1.0 ) {
        return;
      }

      if ( this.playingProperty.get() ) {

        // Using real world time for this results in the atoms moving a little slowly, so the time step is adjusted
        // here.  The multipliers were empirically determined.

        switch( this.simSpeedProperty.get() ) {
          case 'normal':
            break;
          case 'slow':
            dt = dt / 8;
            break;
          default:
            assert( false, 'invalid setting for model speed' );
        }
      }

      if ( self.playingProperty.get() === true ) {
        this.masses.forEach( function( mass ) {
          // Fall if not hung or grabbed
          if ( mass.springProperty.get() === null && !mass.userControlledProperty.get() ) {
            mass.fallWithGravity( self.gravityProperty.get(), self.floorY, dt );
          }
        } );

        if ( this.timerRunningProperty.get() ) {
          this.timerSecondProperty.set( this.timerSecondProperty.get() + dt );
        }

        // Oscillate springs
        this.springs.forEach( function( spring ) {
          spring.oscillate( dt );
        } );
      }
    }
  } );
} );