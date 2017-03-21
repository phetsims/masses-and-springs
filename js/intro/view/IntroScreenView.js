// Copyright 2017, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantsControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/ConstantsControlPanel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Property = require( 'AXON/Property' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var SpringLengthControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/SpringLengthControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = .3;

  // strings
  var constantString = require( 'string!MASSES_AND_SPRINGS/constant' );

  // TODO: Move model elements into IntroModel and out of CommonModel and IntroScreenView
  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreenView( model, tandem ) {

    var self = this;

    // Spring 1 is refernced multiple times in the intro screen
    var spring1 = model.springs[ 0 ];
    
    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );

    // Spring Constant Length Control Panel
    this.springLengthControlPanel = new SpringLengthControlPanel(
      spring1.naturalRestingLengthProperty,
      new RangeWithValue( .1, .5, .3 ),
      StringUtils.format( 'Length 1', 1 ),
      tandem.createTandem( 'springLengthControlPanel' ),
      {
        right: this.springHangerNode.springHangerNode.left - 40,
        top: this.topSpacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      } );
    this.addChild( this.springLengthControlPanel );


    // @private panel that keeps thickness/spring constant at constant value
    this.constantsControlPanel = new ConstantsControlPanel(
      model.selectedConstantProperty,
      constantString,
      tandem.createTandem( 'constantsControlPanel' ),
      {
        minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 60,
        left: this.firstSpringConstantControlPanel.left,
        top: this.firstSpringConstantControlPanel.bottom + this.topSpacing
      }
    );
    this.addChild( this.constantsControlPanel );

    // initial parameters set for both scenes
    // @private {read-write} array of parameters for scene 1
    var scene1Parameters = model.stashSceneParameters();

    // @private {read-write} array of parameters for scene 2
    spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH / 2 );
    var scene2Parameters = model.stashSceneParameters();

    spring1.naturalRestingLengthProperty.set( MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH );

    // Link that is responsible for switching the scenes
    model.springLengthModeProperty.lazyLink( function( mode ) {
      /**@private Functions used to determine the inverse relationship between the length and springConstant/thickness
       Functions follow logic:
       -SpringConstant = constant --> As length increases, spring thickness decreases (and vice versa)
       -Thickness = constant -->As length increases, spring constant decreases  (and vice versa)
       */
      self.resetMassLayer();

      // Restoring spring parameters when scenes are switched
      if ( mode === 'same-length' ) {
        // Manages stashing and applying parameters to each scene
        scene2Parameters = model.stashSceneParameters();
        model.applySceneParameters( scene1Parameters );
        self.springLengthControlPanel.visible = false;
      }

      else if ( mode === 'adjustable-length' ) {
        // Manages stashing and applying parameters to each scene
        scene1Parameters = model.stashSceneParameters();
        model.applySceneParameters( scene2Parameters );
        self.springLengthControlPanel.visible = true;

        // Manages logic for updating spring thickness and spring constant
        self.firstOscillatingSpringNode.lineWidthProperty.set( self.secondOscillatingSpringNode.lineWidthProperty.get() );
        spring1.naturalRestingLengthProperty.link( function( naturalRestingLength ) {
          assert && assert(
            model.springLengthModeProperty.get() === 'adjustable-length',
            'Natural resting length should never change unless sim is in adjustable-length mode.'
          );

          if ( model.selectedConstantProperty.get() === 'spring-constant' ) {
            // TODO: Sloppy implementation. See https://github.com/phetsims/masses-and-springs/issues/34
            var tempSpringConstant = spring1.springConstantProperty.get();
            spring1.springConstantProperty.set( spring1.springConstantProperty.get() * .99 );
            spring1.springConstantProperty.set( tempSpringConstant );
            spring1.updateThickness( naturalRestingLength, spring1.springConstantProperty.get() );
          }
          else if ( model.selectedConstantProperty.get() === 'spring-thickness' ) {
            spring1.updateSpringConstant( naturalRestingLength, self.firstOscillatingSpringNode.lineWidthProperty.get() );
          }
        } );

        model.selectedConstantProperty.link( function( selectedConstant ) {
          assert && assert(
            model.springLengthModeProperty.get() === 'adjustable-length',
            'Natural resting length should never change unless sim is in adjustable-length mode.'
          );

          // Manages logic for changing between constant parameters
          // TODO: Enumerate these constants for checks
          if ( selectedConstant === 'spring-constant' ) {
            spring1.springConstantProperty.reset();
            spring1.updateThickness( spring1.naturalRestingLengthProperty.get(), spring1.springConstantProperty.get() );
          }
          else if ( selectedConstant === 'spring-thickness' ) {
            spring1.thicknessProperty.reset();
            spring1.updateSpringConstant( spring1.naturalRestingLengthProperty.get(), spring1.thicknessProperty.get() );
          }
        } );
      }
      // Used for testing purposes
      // Property.multilink( [spring1.springConstantProperty, spring1.thicknessProperty ], function(springConstant,springThickness) {
      //
      //   console.log( 'springConstant = ' +springConstant + '\t\t' + 'thickness = ' + springThickness );
      // } );

      // Manages visibility of panels for spring length, spring constant, and thickness
      self.constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
    } );

    // @public {read-only} Springs created to be used in the icons for the scene selection tabs
    this.springsIcon = [
      new Spring( new Vector2( .65, model.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'firstIconSpring' ) ),
      new Spring( new Vector2( .85, model.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'secondIconSpring' ) ),
      new Spring( new Vector2( .65, model.ceilingY + .17 ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'thirdIconSpring' ) )
    ];

    // @private {read-only} Creation of spring for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode( this.springsIcon[ 0 ], this.modelViewTransform2 );
    firstSpringIcon.loopsProperty.set( 10 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode( this.springsIcon[ 1 ], this.modelViewTransform2 );
    secondSpringIcon.loopsProperty.set( 10 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var thirdSpringIcon = new OscillatingSpringNode( this.springsIcon[ 2 ], this.modelViewTransform2 );
    thirdSpringIcon.loopsProperty.set( 5 );
    thirdSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} White background for scene switching icons
    var iconBackground = new Rectangle( firstSpringIcon.x - 40, 25, 160, 190, 2, 2, { fill: 'white' } );

    // @private {read-only} Creation of same length icon node
    var sameLengthIcon = new Node( { scale: IMAGE_SCALE } );
    sameLengthIcon.addChild( iconBackground );
    sameLengthIcon.addChild( firstSpringIcon );
    sameLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of adjustable length icon node
    var differentLengthIcon = new Node( { scale: IMAGE_SCALE } );
    differentLengthIcon.addChild( iconBackground );
    differentLengthIcon.addChild( thirdSpringIcon );
    differentLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of toggled modes for scene selection
    var toggleButtonsContent = [ {
      value: 'same-length',
      node: sameLengthIcon
    }, {
      value: 'adjustable-length',
      node: differentLengthIcon
    } ];

    // @private {read-only} Creation of icons for scene selection
    var sceneRadioButtonGroup = new RadioButtonGroup( model.springLengthModeProperty, toggleButtonsContent, {
      buttonContentXMargin: 4,
      buttonContentYMargin: 4,
      top: this.toolboxPanel.bottom + 55,
      right: this.gravityControlPanel.right,
      baseColor: 'black',
      selectedStroke: 'yellow',
      deselectedStroke: 'yellow',
      selectedLineWidth: 1.3,
      deselectedLineWidth: 0.6,
      orientation: 'horizontal',
      spacing: 13
    } );
    this.addChild( sceneRadioButtonGroup );
    sceneRadioButtonGroup.moveToBack();
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );