// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 *
 * Common view mode for a screen using two masses.
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var GravityControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityControlPanel' );
  var DraggableRulerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableRulerNode' );
  var IndicatorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/common/view/IndicatorVisibilityControlPanel' );
  var MASPlayPauseStepControl = require( 'MASSES_AND_SPRINGS/common/view/MASPlayPauseStepControl' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReturnButtonNode = require( 'MASSES_AND_SPRINGS/common/view/ReturnButtonNode' );
  var ReferenceLine = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLine' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  var SpringConstantControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringConstantControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var normalString = require( 'string!MASSES_AND_SPRINGS/normal' );
  var slowMotionString = require( 'string!MASSES_AND_SPRINGS/slowMotion' );

  // constants
  var MAX_TEXT_WIDTH = 80;

  /**
   * TODO::: Remove mvt transforms from view objects
   * TODO::: Factor out colors to a Constants object
   * TODO::: Factor out thumb size, track size, etc other slider properties
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function TwoSpringView( model ) {
    this.model = model; // Make model available for reset
    var self = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // Needed for grey bar above springHangerNode
    var mvtSpringHeight = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * 1 ),
      397 );
    this.mvt = mvtSpringHeight; // Make mvt available to descendant types.

    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * .98 ),
      397 );
    this.mvt = mvt; // Make mvt available to descendant types.

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        gravityControlPanel.reset();
        massNodes.forEach( function( massNode ) {
          massNode.moveToFront();
        } );
      },
      right: this.layoutBounds.right - 10,
      bottom: mvt.modelToViewY( model.floorY )
    } );
    this.addChild( resetAllButton );

    // Return Button
    var returnButton = new ReturnButtonNode( {
      listener: model.enableReturn.bind( model ),
      top: mvt.modelToViewY( model.ceilingY ),
      left: mvt.modelToViewY( model.ceilingY ),
      maxWidth: 55
    } );
    this.addChild( returnButton );

    // Play/Pause and Step Forward Button Control
    this.addChild( new MASPlayPauseStepControl( model ) );

    // Sim speed controls
    var speedSelectionButtonOptions = {
      font: new PhetFont( 14 ),
      maxWidth: MAX_TEXT_WIDTH
    };
    var speedSelectionButtonRadius = 8;
    var normalText = new Text( normalString, speedSelectionButtonOptions );
    var normalMotionRadioBox = new AquaRadioButton( model.simSpeedProperty, 'normal', normalText, {
      radius: speedSelectionButtonRadius
    } );

    var slowText = new Text( slowMotionString, speedSelectionButtonOptions );
    var slowMotionRadioBox = new AquaRadioButton( model.simSpeedProperty, 'slow', slowText, {
      radius: speedSelectionButtonRadius
    } );

    var radioButtonSpacing = 4;
    var speedControl = new VBox( {
      align: 'left',
      spacing: radioButtonSpacing,
      children: [ normalMotionRadioBox, slowMotionRadioBox ],
      right: resetAllButton.left - 30,
      centerY: resetAllButton.centerY
    } );
    this.addChild( speedControl );

    // Add masses
    this.massLayer = new Node();
    var massNodes = [];
    model.masses.forEach( function( mass ) {
      var massNode = new MassNode( mass, mvt, self, model );
      self.massLayer.addChild( massNode );
      // Keeps track of the mass node to restore original Z order.
      massNodes.push( massNode );
    } );

    //  TODO: put in a vbox?? hmm... wrong place for this comment??
    this.addChild( new OscillatingSpringNode( model.springs[ 0 ], mvtSpringHeight ) );
    this.addChild( new OscillatingSpringNode( model.springs[ 1 ], mvtSpringHeight ) );

    // Spring Hanger Node
    var springHangerNode = new SpringHangerNode( model, mvt );
    this.addChild( springHangerNode );

    // Spring Constant Control Panels
    var firstSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.format( springConstantString, 1 ), {
        right: springHangerNode.springHangerNode.left - 40,
        top: mvt.modelToViewY( model.ceilingY ),
        maxWidth: 125
      } );
    this.addChild( firstSpringConstantControlPanel );

    var secondSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 1 ].springConstantProperty,
      model.springs[ 1 ].springConstantRange,
      StringUtils.format( springConstantString, 2 ), {
        left: springHangerNode.springHangerNode.right + 40,
        top: mvt.modelToViewY( model.ceilingY ),
        maxWidth: 125
      } );
    this.addChild( secondSpringConstantControlPanel );

    this.referenceLine = new ReferenceLine(
      this.layoutBounds.getCenter().minus( new Vector2( 45, 0 ) ),
      this.layoutBounds,
      250,
      model.referenceLineVisibleProperty
    );
    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel( model, {
      top: mvt.modelToViewY( model.ceilingY ),
      left: secondSpringConstantControlPanel.right + 10,
      maxWidth: 180
    } );
    this.addChild( indicatorVisibilityControlPanel );

    // Gravity Control Panel
    var gravityControlPanel = new GravityControlPanel(
      model.gravityProperty,
      model.gravityRange,
      model.bodies,
      this,
      {
        left: indicatorVisibilityControlPanel.left,
        top: indicatorVisibilityControlPanel.bottom + 10,
        minWidth: 1,
        maxWidth: 180
      }
    );
    this.addChild( gravityControlPanel );
    
    this.addChild( this.referenceLine );

    this.addChild( this.massLayer );

    this.addChild( new DraggableRulerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 50, mvt.modelToViewY( model.ceilingY ) + 35 ),
      model.rulerVisibleProperty
    ) );

  }

  massesAndSprings.register( 'TwoSpringView', TwoSpringView );

  return inherit( ScreenView, TwoSpringView );
} );