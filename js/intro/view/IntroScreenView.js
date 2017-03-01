// Copyright 2017, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington
 * @author Denzell Barnett
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

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreenView( model, tandem ) {

    var self = this;

    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );

    // Spring Constant Length Control Panel
    this.springLengthControlPanel = new SpringLengthControlPanel(
      model.springs[ 0 ].naturalRestingLengthProperty,
      new RangeWithValue( .1, .5, .3 ),
      StringUtils.format( 'Length 1', 1 ),
      {
        right: this.springHangerNode.springHangerNode.left - 40,
        top: this.topSpacing,
        maxWidth: 125
      } );
    this.addChild( this.springLengthControlPanel );

    /** @private Functions used to determine the inverse relationship between the length and springConstant/thickness
     Functions follow logic:
     -SpringConstant = constant
     As length increases, spring thickness decreases (and vice versa)
     -Thickness = constant
     As length increases, spring constant decreases  (and vice versa)
     */
    this.mapRestingLengthToSpringConstant = new LinearFunction( .1, .5, 1, 7 );
    this.mapRestingLengthToThickness = new LinearFunction( .1, .5, 5, 15 );
    this.mapRestingLengthToThickness2 = new LinearFunction( .1, .5, self.firstOscillatingSpringNode.lineWidthProperty.get(), self.firstOscillatingSpringNode.lineWidthProperty.get() );

    // @private panel that keeps thickness/spring constant at constant value
    this.constantsControlPanel = new ConstantsControlPanel(
      model.selectedConstantProperty,
      constantString,
      tandem,
      {
        minWidth: this.firstSpringConstantControlPanel.maxWidth,
        left: this.firstSpringConstantControlPanel.left,
        top: this.firstSpringConstantControlPanel.bottom + this.topSpacing
      }
    );
    this.addChild( this.constantsControlPanel );

    // Link that is responsible for switching the scenes
    model.springLengthModeProperty.link( function( mode ) {
      // Toggle visibility of panels
      self.springLengthControlPanel.visible = (mode === 'adjustable-length');

      self.constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;

      // TODO: Remove these resets to preserve state.
      self.firstOscillatingSpringNode.lineWidthProperty.set( self.secondOscillatingSpringNode.lineWidthProperty.get() );
      model.springs[ 0 ].springConstantProperty.reset();
      model.springs[ 1 ].reset();
      self.firstOscillatingSpringNode.lineWidthProperty.set( self.firstOscillatingSpringNode.lineWidthProperty.get() );
      Property.multilink( [ model.selectedConstantProperty, model.springs[ 0 ].naturalRestingLengthProperty ], function() {
        {
          if ( model.selectedConstantProperty.get() === 'spring-constant' ) {
            self.firstOscillatingSpringNode.lineWidthProperty.set( self.mapRestingLengthToSpringConstant( model.springs[ 0 ].naturalRestingLengthProperty.get() ) );
          }
          else if ( model.selectedConstantProperty.get() === 'spring-thickness' ) {
            model.springs[ 0 ].springConstantProperty.set( self.mapRestingLengthToThickness( model.springs[ 0 ].naturalRestingLengthProperty.get() ) );
            self.firstOscillatingSpringNode.lineWidthProperty.set( self.mapRestingLengthToThickness2( model.springs[ 0 ].naturalRestingLengthProperty.get() ) );
          }
        }
      } );

      // Reset springs when scenes are switched
      if ( mode === 'same-length' ) {
        self.firstOscillatingSpringNode.lineWidthProperty.set( self.secondOscillatingSpringNode.lineWidthProperty.get() );
        model.springs[ 0 ].reset();
        model.springs[ 1 ].reset();
      }
    } );

    // @public {read-only} Springs created to be used in the icons for the scene selection tabs
    this.springsIcon = [
      new Spring( new Vector2( .65, model.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'firstIconSpring' ) ),
      new Spring( new Vector2( .85, model.ceilingY ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'secondIconSpring' ) ),
      new Spring( new Vector2( .65, model.ceilingY + .17 ), MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH, new RangeWithValue( 5, 15, 9 ), 0, tandem.createTandem( 'thirdIconSpring' ) )
    ];

    // @private {read-only} Creation of spring for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode( this.springsIcon[ 0 ], this.mvt );
    firstSpringIcon.loopsProperty.set( 10 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode( this.springsIcon[ 1 ], this.mvt );
    secondSpringIcon.loopsProperty.set( 10 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var thirdSpringIcon = new OscillatingSpringNode( this.springsIcon[ 2 ], this.mvt );
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